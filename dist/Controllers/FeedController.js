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
const express_validator_1 = require("express-validator");
const index_1 = require("../Services/index");
/*
get
/feeds
*/
const showFeed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.body.group.id;
    try {
        const data = yield index_1.FeedService.showFeed(groupId);
        return res
            .send(data);
    }
    catch (error) {
        next(error);
    }
});
/*
  post
  /feeds
  */
const createFeed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new Error('Error at Controller: createFeed');
    }
    const userId = req.body.user._id;
    const feedCreateDto = req.body;
    //const { roomId } = req.params;
    try {
        //const data =
        yield index_1.FeedService.createFeed(feedCreateDto);
        return res.status(200).send('Feed Created!');
        //   util.success(statusCode.CREATED, message.CREATE_EVENT_SUCCESS, data)
        // );
    }
    catch (error) {
        next(error);
    }
});
/*
  patch
  /feeds/:feedId
   */
const updateFeed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new Error('Error at Controller: updateFeed');
    }
    const FeedUpdateRequestDTO = req.body;
    //const { feedId } = req.params;
    try {
        yield index_1.FeedService.updateFeedContent(FeedUpdateRequestDTO);
        return res.status(200).send('Feed Updated!');
        //   util.success(statusCode.CREATED, message.CREATE_EVENT_SUCCESS, data)
        // );
    }
    catch (error) {
        next(error);
    }
});
/*
 delete
 /feeds/:feedId
 */
const deleteFeed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new Error('Error at Controller: updateFeed');
    }
    const feedId = parseInt(req.params.feedId);
    try {
        yield index_1.FeedService.deleteFeed(feedId);
        return res
            .status(200)
            .send('Feed Deleted!');
        //   util.success(statusCode.CREATED, message.CREATE_EVENT_SUCCESS, data)
        // );
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    showFeed,
    createFeed,
    updateFeed,
    deleteFeed
};
//# sourceMappingURL=FeedController.js.map