import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { verifyAdminToken } from '@/lib/adminAuth';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

// GET - Récupérer une catégorie par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const category = await Category.findById(params.id)
      .populate('parentCategory', 'name slug')
      .populate('subcategories', 'name slug isActive')
      .lean();

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Compter les produits dans cette catégorie
    const productCount = await Product.countDocuments({ category: category.slug });

    return NextResponse.json({
      success: true,
      data: {
        ...category,
        productCount
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une catégorie
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérification de l'authentification admin
    const adminData = await verifyAdminToken(request);
    if (!adminData) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await connectDB();

    // Vérifier que la catégorie existe
    const existingCategory = await Category.findById(params.id);
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    
    // Extraction des données
    const updateData: any = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      parentCategory: formData.get('parentCategory') as string || null,
      isActive: formData.get('isActive') === 'true',
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      seoTitle: formData.get('seoTitle') as string,
      seoDescription: formData.get('seoDescription') as string,
    };

    // Validation des champs requis
    if (!updateData.name) {
      return NextResponse.json(
        { success: false, error: 'Le nom de la catégorie est requis' },
        { status: 400 }
      );
    }

    // Vérification de l'unicité du slug (sauf pour la catégorie actuelle)
    if (updateData.slug && updateData.slug !== existingCategory.slug) {
      const duplicateCategory = await Category.findOne({ 
        slug: updateData.slug,
        _id: { $ne: params.id }
      });
      if (duplicateCategory) {
        return NextResponse.json(
          { success: false, error: 'Ce slug existe déjà' },
          { status: 400 }
        );
      }
    }

    // Gestion de l'image
    const imageFile = formData.get('image') as File;
    const removeImage = formData.get('removeImage') === 'true';

    if (removeImage && existingCategory.image) {
      // Supprimer l'ancienne image de Cloudinary
      try {
        await deleteFromCloudinary(existingCategory.image);
        updateData.image = '';
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'image:', error);
      }
    } else if (imageFile && imageFile.size > 0) {
      try {
        // Supprimer l'ancienne image si elle existe
        if (existingCategory.image) {
          await deleteFromCloudinary(existingCategory.image);
        }
        
        // Upload de la nouvelle image
        const imageUrl = await uploadToCloudinary(imageFile, 'categories');
        updateData.image = imageUrl;
      } catch (uploadError) {
        console.error('Erreur upload image:', uploadError);
        return NextResponse.json(
          { success: false, error: 'Erreur lors de l\'upload de l\'image' },
          { status: 400 }
        );
      }
    }

    // Vérifier qu'une catégorie ne peut pas être son propre parent
    if (updateData.parentCategory === params.id) {
      return NextResponse.json(
        { success: false, error: 'Une catégorie ne peut pas être son propre parent' },
        { status: 400 }
      );
    }

    // Mise à jour de la catégorie
    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('parentCategory', 'name slug');

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Catégorie mise à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Une catégorie avec ce slug existe déjà' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour de la catégorie' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une catégorie
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérification de l'authentification admin
    const adminData = await verifyAdminToken(request);
    if (!adminData) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await connectDB();

    // Vérifier que la catégorie existe
    const category = await Category.findById(params.id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des produits dans cette catégorie
    const productCount = await Product.countDocuments({ category: category.slug });
    if (productCount > 0) {
      return NextResponse.json(
        { success: false, error: `Impossible de supprimer cette catégorie car elle contient ${productCount} produit(s)` },
        { status: 400 }
      );
    }

    // Vérifier s'il y a des sous-catégories
    const subcategoryCount = await Category.countDocuments({ parentCategory: params.id });
    if (subcategoryCount > 0) {
      return NextResponse.json(
        { success: false, error: `Impossible de supprimer cette catégorie car elle contient ${subcategoryCount} sous-catégorie(s)` },
        { status: 400 }
      );
    }

    // Supprimer l'image de Cloudinary si elle existe
    if (category.image) {
      try {
        await deleteFromCloudinary(category.image);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'image:', error);
      }
    }

    // Supprimer la catégorie
    await Category.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Catégorie supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression de la catégorie' },
      { status: 500 }
    );
  }
}
