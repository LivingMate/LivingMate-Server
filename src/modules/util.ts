const util = {
    success: (code: number, message: string, data?: any) => ({
      code,
      message,
      data,
    }),
    error: (code: number, message: string) => ({
      code,
      message,
    }),
  };
  
  export default util;
  