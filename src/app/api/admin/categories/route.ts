import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import { verifyAdminToken } from '@/lib/adminAuth';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

// GET - Liste des catégories avec filtres et pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const parentId = searchParams.get('parentId') || '';

    // Construction du filtre
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    if (parentId === 'null') {
      filter.parentCategory = null;
    } else if (parentId) {
      filter.parentCategory = parentId;
    }

    // Calcul de la pagination
    const skip = (page - 1) * limit;

    // Requête avec population des relations
    const categories = await Category.find(filter)
      .populate('parentCategory', 'name slug')
      .populate('subcategories', 'name slug isActive')
      .sort({ sortOrder: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Compte total pour la pagination
    const total = await Category.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    
    // Extraction des données
    const categoryData = {
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
    if (!categoryData.name) {
      return NextResponse.json(
        { success: false, error: 'Le nom de la catégorie est requis' },
        { status: 400 }
      );
    }

    // Vérification de l'unicité du slug
    if (categoryData.slug) {
      const existingCategory = await Category.findOne({ slug: categoryData.slug });
      if (existingCategory) {
        return NextResponse.json(
          { success: false, error: 'Ce slug existe déjà' },
          { status: 400 }
        );
      }
    }

    // Gestion de l'upload d'image
    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size > 0) {
      try {
        const imageUrl = await uploadToCloudinary(imageFile, 'categories');
        categoryData.image = imageUrl;
      } catch (uploadError) {
        console.error('Erreur upload image:', uploadError);
        return NextResponse.json(
          { success: false, error: 'Erreur lors de l\'upload de l\'image' },
          { status: 400 }
        );
      }
    }

    // Création de la catégorie
    const category = new Category(categoryData);
    await category.save();

    // Population des relations pour la réponse
    await category.populate('parentCategory', 'name slug');

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Catégorie créée avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    
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
      { success: false, error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    );
  }
}
