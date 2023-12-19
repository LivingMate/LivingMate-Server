"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFeedContent = exports.showFeed = exports.pinFeed = exports.findFeedByFeedId = exports.deleteFeed = exports.createFeed = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient;
//신규 피드 등록
const createFeed = (FeedCreateRequestDto) => __awaiter(void 0, void 0, void 0, function* () {
    const newFeed = yield prisma.feed.create({
        data: {
            userId: FeedCreateRequestDto.userId,
            groupId: FeedCreateRequestDto.groupId,
            text: FeedCreateRequestDto.feedContent,
        }
    });
    return newFeed;
});
exports.createFeed = createFeed;
//피드 보여주기 : 객체 타입의 배열로 반환됨! 우선 위의 10개만 반환되게 했음.  //
const showFeed = (GroupId) => __awaiter(void 0, void 0, void 0, function* () {
    const Feeds = yield prisma.feed.findMany({
        where: {
            groupId: GroupId
        },
        orderBy: {
            id: 'desc',
        },
    });
    return Feeds;
});
exports.showFeed = showFeed;
//피드내용 수정
const updateFeedContent = (FeedUpdateRequestDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Feed = yield findFeedByFeedId(FeedUpdateRequestDto.feedId);
        if (Feed) {
            const UpdatedFeed = yield prisma.feed.update({
                where: {
                    id: FeedUpdateRequestDto.feedId,
                },
                data: {
                    text: FeedUpdateRequestDto.feedContent,
                },
            });
            return UpdatedFeed;
        }
        else {
            throw new Error('Feed not found');
        }
    }
    catch (error) {
        throw new Error('Could not update Feed');
    }
});
exports.updateFeedContent = updateFeedContent;
//피드 고정 -> 이거 업데이트에 한번에 합칠 수도 있는데.... 우선 모르고 걍 만들었으니 놔둬 봄... 
const pinFeed = (FeedId) => __awaiter(void 0, void 0, void 0, function* () {
    const pinnedFeed = yield prisma.feed.update({
        where: {
            id: FeedId,
        },
        data: {
            pin: true
        }
    });
    return pinnedFeed; //리턴값을 어떻게 줘야 할지 모르겠는디.... 얘를 줘야 하나.. 아님 showFeed()를 걸어줘야 하나?
});
exports.pinFeed = pinFeed;
//피드 삭제
const deleteFeed = (FeedId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const toBeDeleted = yield findFeedByFeedId(FeedId);
        if (!toBeDeleted) {
            throw new Error("Feed not found");
        }
        yield prisma.feed.delete({
            where: {
                id: FeedId,
            },
        });
        return 0;
        //삭제 이후에는 null값이나 빈 객체를 반환하기 때문에... 왜 Hous 팀이 msg를 만들었는지 알겠음. msg를 만들거나.. 해아 할 것 같음
    }
    catch (error) {
        throw new Error('Error deleting feed');
    }
});
exports.deleteFeed = deleteFeed;
//공동일정 조율
//피드 찾기
const findFeedByFeedId = (FeedId) => __awaiter(void 0, void 0, void 0, function* () {
    const Feed = yield (prisma.feed.findUnique({
        where: {
            id: FeedId
        }
    }));
    if (!Feed) {
        throw new Error('No Feed Found!');
    }
    return Feed;
});
exports.findFeedByFeedId = findFeedByFeedId;
//# sourceMappingURL=FeedService.js.map