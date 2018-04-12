exports.TemplateResponse = function (admin, convertManager, generateManager, response, requestMessage, responseMsg, responseButton) {
    global.logManager.PrintLogMessage("ResponseManager", "TemplateResponse",
        "result message: " + responseMsg["text"],
        global.defineManager.LOG_LEVEL_INFO)

    orderId = convertManager.ConvertOrderToNumber(requestMessage["content"])
    global.logManager.SaveLog(admin, generateManager, orderId, requestMessage["user_key"], responseMsg["text"])

    responseMsg = {"message": responseMsg,
        "keyboard": {"type" : "buttons", "buttons" : responseButton}}

    response.setHeader('Content-Type', 'application/json');
    response.status(200).send(JSON.stringify(responseMsg))
}

exports.TemplateOfResponse = function (responseJsonDicData, responseCode, response) {

    global.logManager.PrintLogMessage("ResponseManager", "TemplateOfResponse", "res code: " + responseCode,
        global.defineManager.LOG_LEVEL_DEBUG)

    template = {}
    template["code"] = responseCode
    template["data"] = responseJsonDicData

    response.setHeader('Content-Type', 'application/json');
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader('Access-Control-Allow-Methods', '*')
    response.setHeader("Access-Control-Allow-Headers", "*")
    response.setHeader("Access-Control-Allow-Credentials", true)
    response.setHeader('Access-Control-Request-Method', '*');
    response.status(responseCode).send(JSON.stringify(template));
}

exports.LineTemplateResponse = function (responseType) {

    responseType = parseInt(responseType, 0)
    global.logManager.PrintLogMessage("ResponseManager", "LineTemplateResponse", "response type: " + responseType,
        global.defineManager.LOG_LEVEL_DEBUG)
    replyData = {}
    switch(responseType){
        case global.defineManager.LINE_RESPONSE_TEMPLATE_TEXT:
            replyData = { type: 'text', text: 'Hello, world' }
            break;
        case global.defineManager.LINE_RESPONSE_TEMPLATE_MULTI_TEXT:
            replyData = [
                { type: 'text', text: 'Hello, world 1' },
                { type: 'text', text: 'Hello, world 2' }
            ]
            break;
        case global.defineManager.LINE_RESPONSE_TEMPLATE_IMAGE:
            replyData = {
                type: 'image',
                originalContentUrl: 'https://example.com/original.jpg',
                previewImageUrl: 'https://example.com/preview.jpg'
            }
            break;
        case global.defineManager.LINE_RESPONSE_TEMPLATE_VIDEO:
            replyData = {
                type: 'video',
                originalContentUrl: 'https://example.com/original.mp4',
                previewImageUrl: 'https://example.com/preview.jpg'
            }
            break;
        case global.defineManager.LINE_RESPONSE_TEMPLATE_AUDIO:
            replyData = {
                type: 'audio',
                originalContentUrl: 'https://example.com/original.m4a',
                duration: 240000
            }
            break;
        case global.defineManager.LINE_RESPONSE_TEMPLATE_LOCATION:
            replyData = {
                type: 'location',
                title: 'my location',
                address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
                latitude: 35.65910807942215,
                longitude: 139.70372892916203
            }
            break;
        case global.defineManager.LINE_RESPONSE_TEMPLATE_STICKER:
            replyData = {
                type: 'sticker',
                packageId: '1',
                stickerId: '1'
            }
            break;
        case global.defineManager.LINE_RESPONSE_TEMPLATE_IMAGE_MAP:
            replyData = {
                type: 'imagemap',
                baseUrl: 'https://example.com/bot/images/rm001',
                altText: 'this is an imagemap',
                baseSize: { height: 1040, width: 1040 },
                actions: [{
                    type: 'uri',
                    linkUri: 'https://example.com/',
                    area: { x: 0, y: 0, width: 520, height: 1040 }
                }, {
                    type: 'message',
                    text: 'hello',
                    area: { x: 520, y: 0, width: 520, height: 1040 }
                }]
            }
            break;
        case global.defineManager.LINE_RESPONSE_TEMPLATE_BUTTONS:
            replyData = {
                type: 'template',
                altText: 'this is a buttons template',
                template: {
                    type: 'buttons',
                    thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
                    title: 'Menu',
                    text: 'Please select',
                    actions: [{
                        type: 'postback',
                        label: 'Buy',
                        data: 'action=buy&itemid=123'
                    }, {
                        type: 'postback',
                        label: 'Add to cart',
                        data: 'action=add&itemid=123'
                    }, {
                        type: 'uri',
                        label: 'View detail',
                        uri: 'http://example.com/page/123'
                    }]
                }
            }
            break;
        case global.defineManager.LINE_RESPONSE_TEMPLATE_CONFIRM:
            replyData = {
                type: 'template',
                altText: 'this is a confirm template',
                template: {
                    type: 'confirm',
                    text: 'Are you sure?',
                    actions: [{
                        type: 'message',
                        label: 'Yes',
                        text: 'yes'
                    }, {
                        type: 'message',
                        label: 'No',
                        text: 'no'
                    }]
                }
            }
            break;
        case global.defineManager.LINE_RESPONSE_TEMPLATE_CAROUSEL:
            replyData = {
                type: 'template',
                altText: 'this is a carousel template',
                template: {
                    type: 'carousel',
                    columns: [{
                        thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
                        title: 'this is menu',
                        text: 'description',
                        actions: [{
                            type: 'postback',
                            label: 'Buy',
                            data: 'action=buy&itemid=111'
                        }, {
                            type: 'postback',
                            label: 'Add to cart',
                            data: 'action=add&itemid=111'
                        }, {
                            type: 'uri',
                            label: 'View detail',
                            uri: 'http://example.com/page/111'
                        }]
                    }, {
                        thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
                        title: 'this is menu',
                        text: 'description',
                        actions: [{
                            type: 'postback',
                            label: 'Buy',
                            data: 'action=buy&itemid=222'
                        }, {
                            type: 'postback',
                            label: 'Add to cart',
                            data: 'action=add&itemid=222'
                        }, {
                            type: 'uri',
                            label: 'View detail',
                            uri: 'http://example.com/page/222'
                        }]
                    }]
                }
            }
            break;
        default:
            break;
    }

    return replyData
}