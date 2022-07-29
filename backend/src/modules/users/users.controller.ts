import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
	UseGuards,
	UsePipes,
	ValidationPipe,
	Version
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { AssignMenuDto } from "./dto/assign-menus.dto";
import { AssignPermissionDto } from "./dto/assign-permission.dto";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "@common/guard/jwt-auth.guard";
import { RolesGuard } from "@common/guard/roles.guard";
import { Roles } from "@common/decorators";
import { RolesEnum } from "@common/action";

@Controller("users")
@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class UsersController {
	constructor(private userService: UsersService) {}

	@Get("profile")
	@Version("1")
	@Roles(RolesEnum.ADMIN)
	@HttpCode(HttpStatus.OK)
	async profile(@Req() req: Request, @Res() res: Response) {
		const result = req.user

		res.json({
            statusCode: HttpStatus.OK,
			message: "user profile success",
			data: result
		})
	}

    @Post('assign-permissions')
    @Roles(RolesEnum.ADMIN)
    @Version("1")
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ transform: true }))
    async assignPermission(
        @Body() assignDto: AssignPermissionDto,
        @Req() req: Request, @Res() res: Response
        ){
		const result = await this.userService.assignPermissionsUser(assignDto)

        res.json({
			statusCode: HttpStatus.OK,
			message: "user assign permissions success",
			data: result
		})
    }

    @Post('assign-menus')
    @Roles(RolesEnum.ADMIN)
    @Version("1")
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ transform: true }))
    async assignUserMenu(
        @Body() assignDto: AssignMenuDto,
        @Req() req: Request, @Res() res: Response
    ){
        const result = await this.userService.assignMenuUser(assignDto)

        res.json({
			statusCode: HttpStatus.OK,
			message: "user assign menus success",
			data: result
		})
    }
}
