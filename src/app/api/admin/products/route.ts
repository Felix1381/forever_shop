import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/adminAuth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

// GET - List all products for admin
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (status === 'in-stock') {
      query.inStock = true;
    } else if (status === 'out-of-stock') {
      query.inStock = false;
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin products GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: error instanceof Error && error.message.includes('Authentication') ? 401 : 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request, ['super_admin', 'admin']);
    await dbConnect();

    const formData = await request.formData();
    const productData = JSON.parse(formData.get('data') as string);
    const images = formData.getAll('images') as File[];

    // Upload images to Cloudinary
    const uploadedImages = [];
    for (const image of images) {
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

    const product = new Product({
      ...productData,
      images: uploadedImages,
    });

    await product.save();

    return NextResponse.json({
      success: true,
      product,
      message: 'Produit créé avec succès',
    });
  } catch (error) {
    console.error('Admin products POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: error instanceof Error && error.message.includes('Authentication') ? 401 : 500 }
    );
  }
}
