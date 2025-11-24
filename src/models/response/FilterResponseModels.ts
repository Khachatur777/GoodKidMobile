
export interface IFilterEditResponseModel  {
  messages: string;
  filter: {
    categories: number[];
    language: string;
    age: number;
  };
  success: boolean;
}


export interface IFilterItemsResponseModel  {
  filter: {
    categories: number[];
    language: string;
    age: number;
  };
  success: boolean;
}
