import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/adminAuth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

// GET - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);
    await dbConnect();

    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Admin product GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: error instanceof Error && error.message.includes('Authentication') ? 401 : 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request, ['super_admin', 'admin']);
    await dbConnect();

    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const productData = JSON.parse(formData.get('data') as string);
    const newImages = formData.getAll('images') as File[];
    const imagesToDelete = JSON.parse(formData.get('imagesToDelete') || '[]');

    // Delete removed images from Cloudinary
    for (const imageId of imagesToDelete) {
      try {
        await deleteImage(imageId);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    // Upload new images
    const uploadedImages = [];
    for (const image of newImages) {
      if (image.size > 0) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const base64 = `data:${image.type};base64,${buffer.toString('base64')}`;
        
        const result = await uploadImage(base64, 'rita-aloe/products');
        uploadedImages.push({
          public_id: result.public_id,
          secure_url: result.secure_url,
          alt: productData.name,
        });
      }
    }

    // Combine existing images (not deleted) with new images
    const existingImages = product.images.filter(
      (img: any) => !imagesToDelete.includes(img.public_id)
    );
    const allImages = [...existingImages, ...uploadedImages];

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      {
        ...productData,
        images: allImages,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Produit mis à jour avec succès',
    });
  } catch (error) {
    console.error('Admin product PUT error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: error instanceof Error && error.message.includes('Authentication') ? 401 : 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request, ['super_admin', 'admin']);
    await dbConnect();

    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Delete all product images from Cloudinary
    for (const image of product.images) {
      try {
        await deleteImage(image.public_id);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    // Delete product from database
    await Product.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Produit supprimé avec succès',
    });
  } catch (error) {
    console.error('Admin product DELETE error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: error instanceof Error && error.message.includes('Authentication') ? 401 : 500 }
    );
  }
}
