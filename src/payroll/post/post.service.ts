import { Get, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/Shemas/User.shema';
import { CreatePostDto, CreateUserPostDto } from './dto/CreatePost.dto';
import { Poste } from '../Schema/Poste.schema';

@Injectable()
export class PostService {
    constructor(@InjectModel(Poste.name) private PosteModel:Model<Poste>,@InjectModel(User.name) private userModel:Model<User>){}
    async createUser({PostId,...userDTO}:CreateUserPostDto){
        const findPoste=await this.PosteModel.findById(PostId)
        if (!findPoste) throw new HttpException("Poste not found",400)
        const newUser=new this.userModel(userDTO)
    const savedUser=await newUser.save()
    await this.PosteModel.updateOne({_id:PostId},{$push:{Users:savedUser._id}})
    return savedUser
    }
    async createPoste(CreatePosteDto: CreatePostDto): Promise<Poste> {
        const createdPoste = new this.PosteModel(CreatePosteDto);
        return createdPoste.save();
      }
    
    //   async getAllPosts(): Promise<Poste[]> {
    //     return this.PosteModel.find().populate('Users','name').exec();
    //   }
    async getAllPosts(): Promise<Poste[]> {
        return this.PosteModel.find().populate({
          path: 'Users',
          select: 'name email isActive leaves ', // Sélectionnez les champs que vous souhaitez afficher dans les détails de l'utilisateur
        }).exec();
      }
      async assignUserToPost(userIds: string[], postId: string): Promise<void> {
        const post = await this.PosteModel.findById(postId);
        if (!post) {
          throw new Error('Poste introuvable');
        }
      
        const users = await this.userModel.find({ _id: { $in: userIds } });
        
        if (!users || users.length !== userIds.length) {
          throw new Error('Certains utilisateurs sont introuvables');
        }
        for (const user of users) {
          user.poste = post;
          await user.save();
        }
        // Mettre à jour le poste avec les nouveaux utilisateurs
        post.Users.push(...users);
        await post.save();
      }
      


      // async assignUserToPost(userId:string, postId: string): Promise<void> {
      //   const user = await this.userModel.findById(userId);
      //   const post = await this.PosteModel.findById(postId);
      //   if (!user) {
      //     throw new Error('Utilisateur introuvable');
      //   }
      //   if (!post) {
      //     throw new Error('Poste introuvable');
      //   }
      //   user.poste = post;
      //   await user.save();
      //   post.Users.push(user);
      //   await post.save();
      // }
      async updatePoste(posteId: string, updatePosteDto: CreatePostDto): Promise<Poste> {
        const updatedPoste = await this.PosteModel.findByIdAndUpdate(posteId, updatePosteDto, { new: true });
        if (!updatedPoste) {
          // Gérer le cas où le poste n'est pas trouvé
          throw new NotFoundException(`Poste with id ${posteId} not found`);
        }
        return updatedPoste;
      }


      async getPostById(id: string): Promise<Poste> {
        const post = await this.PosteModel.findById(id);
    
        if (!post) {
          throw new NotFoundException(`Post with ID ${id} not found`);
        }
    
        return post;
      }


      async deletePost(id: string): Promise<void> {
        const result = await this.PosteModel.deleteOne(this.getPostById(id));
    
        if (result == null) {
          throw new NotFoundException(`Post with ID ${id} not found`);
        }
      }

      async getUsersWithNoPost(): Promise<{ id: number; firstName: string; lastName: string }[]> {
        const usersWithNoPost = await this.userModel.aggregate([
          {
            $match: {
              role: 'Employee', // Filtre par rôle "employee"
              $or: [
                { poste: { $exists: false } }, // Poste n'existe pas
                { poste: null }, // Poste est null
                { poste: { $eq: [] } }, // Poste est un tableau vide
              ],
            },
          },
          {
            $project: {
              id: '$_id',
              firstName: 1,
              lastName: 1,
              _id: 0,
            },
          },
        ]);
    
        return usersWithNoPost;
      }


      async deletePoste(posteId: string): Promise<void> {
        // 1. Supprimer le Poste
        await this.PosteModel.findByIdAndDelete(posteId).exec();
    
        // 2. Retirer le Poste des Utilisateurs associés
        const usersWithPoste = await this.userModel.find({ poste: posteId }).exec();
    
        for (const user of usersWithPoste) {
            // Retirer le poste de l'utilisateur
            user.poste = undefined; 
            user.payrolls=undefined;// Ou null, selon votre modèle
            await user.save();
        }
    
        // 3. Enregistrez les Utilisateurs Mis à Jour
        // Notez que si vous avez beaucoup d'utilisateurs, vous pourriez vouloir optimiser cela avec des opérations par lot
    
        console.log(`Poste ${posteId} supprimé et retiré des utilisateurs associés.`);
    }
    async findPosteByPostName(postName: string): Promise<Poste> {
      return this.PosteModel.findOne({ PostName: postName }).exec();
    }
    async findPosteBySalaryRange(minSalary: number, maxSalary: number): Promise<Poste[]> {
      return this.PosteModel.find({
        BasicSalary: { $gte: minSalary, $lte: maxSalary }
      }).exec();
    }
    }

