import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CreatePostDto, CreateUserPostDto } from './dto/CreatePost.dto';
import { PostService } from './post.service';
import { User } from 'src/auth/Shemas/User.shema';
import { Poste } from '../Schema/Poste.schema';
@Controller('post')
export class PostController {
    constructor(private readonly PostService: PostService){};

    @Post('/AddP')
  createPost(@Body() CreatePostDto: CreatePostDto): Promise<Poste> {
    return this.PostService.createPoste(CreatePostDto);
  }
  @Post('/UserPost')
  creaUserP(@Body() CreateUserPostDto: CreateUserPostDto): Promise<User> {
    return this.PostService.createUser(CreateUserPostDto);
  }
  @Get()
  getPost():Promise<Poste[]>{
   return this.PostService.getAllPosts();
  }

  @Post('/postAssign')
  async assignUserToPost(@Body() data: { userIds: string[], postId: string }): Promise<void> {
    const { userIds, postId } = data;
    await this.PostService.assignUserToPost(userIds, postId);
  }
  @Put('update/:id')
  async updatePoste(@Param('id') posteId: string, @Body() updatePosteDto: CreatePostDto): Promise<Poste> {
    try {
      const updatedPoste = await this.PostService.updatePoste(posteId, updatePosteDto);
      return updatedPoste;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }


  @Get('/ById/:id')
  async getPostById(@Param('id') id: string) {
    const post = await this.PostService.getPostById(id);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  @Delete('/delete/:id')
  async deletePost(@Param('id') id: string) {
    await this.PostService.deletePost(id);
    return { message: 'Post deleted successfully' };
  }
  @Get('no-post')
  async getUsersWithNoPost() {
    const users = await this.PostService.getUsersWithNoPost();

    if (!users || users.length === 0) {
      throw new NotFoundException('No users without posts found');
    }

    return users;
  }

  @Delete('deletePoste/:id')
    async deletePoste(@Param('id') posteId: string): Promise<void> {
        try {
            await this.PostService.deletePoste(posteId);
        } catch (error) {
            console.error(`Erreur lors de la suppression du poste ${posteId}:`, error);
            throw new HttpException(`Erreur lors de la suppression du poste ${posteId}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Get(':postName')
    async getPosteByPostName(@Param('postName') postName: string): Promise<Poste> {
      const poste = await this.PostService.findPosteByPostName(postName);
      return poste;
    }
   
    @Get(':minSalary/:maxSalary')
  async getPosteBySalaryRange(
    @Param('minSalary') minSalary: string,
    @Param('maxSalary') maxSalary: string
  ): Promise<Poste[]> {
    const min = parseInt(minSalary, 10);
    const max = parseInt(maxSalary, 10);
    const postes = await this.PostService.findPosteBySalaryRange(min, max);
    return postes;
  }
}
