const util = {
    success: (code: number, message: string, data?: any) => ({
      code,
      message,
      data,
    }),
    fail: (code: number, message: string) => ({
      code,
      message,
    }),
  };
  
  export default util;
  