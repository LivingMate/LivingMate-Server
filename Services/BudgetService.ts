import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient;
import {BudgetBaseDTO} from '../DTOs/Budget/BudgetBaseDTO'
import {BudgetCreateRequestDTO} from '../DTOs/Budget/Request/BudgetCreateRequestDTO'
import {BudgetUpdateRequestDTO} from '../DTOs/Budget/Request/BudgetUpdateRequestDTO'



//지출내역 등록
const createBudget = async(BudgetBaseDTO:BudgetBaseDTO)=>{
    const newBudget = await prisma.userSpendings.create({
        data:{
            userId: BudgetBaseDTO.userid,
            groupId: BudgetBaseDTO.groupid,
            spendings:BudgetBaseDTO.spending,
            category:BudgetBaseDTO.category //모델이 []라서 오류가 생기는 거에용
        }
    })
    //리턴값 어케할지.. showBudget 할지.. 이거 정해야 행
}


//지출내역 보여주기 
const showBudget = async(groupId:string)=>{
    const Budgets = await prisma.userSpendings.findMany({
        take: 10,
        where:{
            groupId:groupId
        }
    })
    return Budgets;
}

//지출내역 수정
const updateBudgetContent = async(BudgetUpdateRequestDTO:BudgetUpdateRequestDTO)=>{
    try{
        const updatedBudget = await prisma.userSpendings.update({
            where:{
                id:BudgetUpdateRequestDTO.budgetId
            },
            data:{
                spendings: BudgetUpdateRequestDTO.spending,
                category: BudgetUpdateRequestDTO.category
            }
        });
    }
    catch(error){
        console.error('Error updating budget', error);
        throw error;
    }

}


//지출내역 삭제
//지출내역 검색
//지출 합산 내역 반환
