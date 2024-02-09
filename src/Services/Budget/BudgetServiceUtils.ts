import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import message from '../../modules/message'


// ------------utils-------------
// 카테고리 이름으로 아이디 찾기
const findCategIdByName = async (categoryName: string) => {
    // userId가 정의되어 있지 않거나 문자열이 아닌 경우 에러 발생
    if (!categoryName || typeof categoryName !== 'string') {
      throw new Error('Invalid categoryName')
    }
  
    const data = await prisma.category.findUnique({
      where: {
        name: categoryName,
      }
    })
    if (!data) {
      throw new Error(message.UNAUTHORIZED)
    }
    return data.id
  }
  
  // 섭카테고리 이름으로 섭카테고리 id 찾기
  async function findSubCategIdByName(subCategoryName: string, groupId: string, categoryId: number) {
    try {
      const subCategory = await prisma.subCategory.findMany({
        where: {
          name: subCategoryName,
          groupId : groupId,
          categoryId: categoryId
        },
      })
      let subcategories: number[] = [];

      subCategory.forEach((subcategory)=>{
        if(!subcategory){
          throw new Error("등록되지 않은 subCategory입니다.")
        }
        else{
          subcategories.push(subcategory.id)
        }
      })
      return subcategories[0];
      
    } catch (error) {
      console.error('Error in findSubCategIdByName:', error)
      throw error
    }
  }
  
  // id를 name으로 반환
  const changeCategIdToName = async (categoryId: number) => {
    try {
      const result = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      })
  
      if (result) {
        return result.name
      } else {
        return 'error'
      }
    } catch (error) {
      console.error('Error in changeCategIdByName:', error)
      throw error
    }
  }
  
  // subId를 name으로 반환
  async function changeSubCategIdToName(subCategoryId: number) {
    try {
      const result = await prisma.subCategory.findUnique({
        where: {
          id: subCategoryId,
        },
      })
  
      if (result) {
        return result.name
      } else {
        return 'error'
      }
    } catch (error) {
      console.error('Error in changeSubCategIdByName:', error)
      throw error
    }
  }


  export {
    findCategIdByName,
    findSubCategIdByName,
    changeCategIdToName,
    changeSubCategIdToName,
  }