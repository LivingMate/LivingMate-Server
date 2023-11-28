import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient;
import {FeedBaseDTO} from '../DTOs/Feed/FeedBaseDTO.js'
import {FeedCreateRequestDTO} from '../DTOs/Feed/Request/FeedCreateRequestDTO.js'
import {FeedUpdateRequestDTO} from '../DTOs/Feed/Request/FeedUpdateRequestDTO.js'
import {FeedBaseResponseDTO} from '../DTOs/Feed/Response/FeedBaseResponseDTO.js'
import {UserService} from './index.js' 


//신규 피드 등록
const createFeed = async(FeedCreateRequestDTO:FeedCreateRequestDTO)=>{
    const newFeed = await prisma.feed.create({
        data:{
            userId: FeedCreateRequestDTO.userId,
            groupId:FeedCreateRequestDTO.groupId,
            text:FeedCreateRequestDTO.feedContent,
        }
    });
    //피드 보여주는 서비스를 불러줘야 하나? .then(ShowFeed()) 막 이렇게?
    showFeed(newFeed.groupId)
    //이렇게 하는게 별로 안 좋을 수도 있다네? Hous에서 어떻게 했는지 보고 바꿔야겠음. 
}



//피드 보여주기 : 객체 타입의 배열로 반환됨! 우선 위의 10개만 반환되게 했음. 
const showFeed = async(GroupId:string)=>{
    const Feeds = await prisma.feed.findMany({
        take:10,
        where:{
            groupId : GroupId
        }
    })
    return Feeds;
}



//피드내용 수정
const updateFeedContent = async(FeedUpdateRequestDTO:FeedUpdateRequestDTO)=>{
    
    try {const Feed = await findFeedByFeedId(FeedUpdateRequestDTO.feedId);
    if(Feed){
    
    const UpdatedFeed = await prisma.feed.update({
        where:{
            id: FeedUpdateRequestDTO.feedId,
        },
        data:{
            text: FeedUpdateRequestDTO.feedContent,
        },
    });
    
    return UpdatedFeed;
    }
    else{
        throw new Error('Feed not found');
    }
}catch(error){
    throw new Error('Could not update Feed');
}

}

//피드 고정 -> 이거 업데이트에 한번에 합칠 수도 있는데.... 우선 모르고 걍 만들었으니 놔둬 봄... 
const pinFeed = async(FeedId:number)=>{
    const pinnedFeed = await prisma.feed.update({
        where:{
            id:FeedId,
        },
        data:{
            pin:true
        }
    })
    return pinFeed; //리턴값을 어떻게 줘야 할지 모르겠는디.... 얘를 줘야 하나.. 아님 showFeed()를 걸어줘야 하나?
}


//피드 삭제
const deleteFeed = async(FeedId:number)=>{
    try{
    const toBeDeleted = await findFeedByFeedId(FeedId)
    if(!toBeDeleted){
        throw new Error("Feed not found")
    }
    
    await prisma.feed.delete({
        where:{
            id:FeedId,
        },
    });

    return 0;
    //삭제 이후에는 null값이나 빈 객체를 반환하기 때문에... 왜 Hous 팀이 msg를 만들었는지 알겠음. msg를 만들거나.. 해아 할 것 같음
    }
    catch(error){
        throw new Error('Error deleting feed');
    }

}



//공동일정 조율




//피드 찾기
const findFeedByFeedId = async(FeedId:number) =>{
    const Feed = await(prisma.feed.findUnique({
        where:{
            id : FeedId
        }
    }))
    if(!Feed){
        throw new Error('No Feed Found!');
    }
    return Feed;
}

export default{
    createFeed,
    deleteFeed,
    findFeedByFeedId,
    pinFeed,
    showFeed,
    updateFeedContent
}