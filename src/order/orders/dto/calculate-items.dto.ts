import { Type } from "class-transformer";
import { IsArray, ValidateNested, IsOptional, IsString } from "class-validator";
import { State } from "src/enum/states.enum";
import { OrderItemDto } from "./create-order.dto";

export class CalculateItemsDto {


  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  shippingState: State;

}