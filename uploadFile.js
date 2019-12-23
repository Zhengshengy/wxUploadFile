class JCUploadFile {
    constructor(fileNum,files){
        this.fileNum = fileNum
        this.files = files
        this.localImg = []
        this.img = []
    };
    judgModel(){
        let model = true
        if (/android/i.test(navigator.userAgent)){
            // 安卓手机
            model = true;
        }
        if (/ipad|iphone|mac/i.test(navigator.userAgent)){
            //  苹果手机
            model = false;
        }
        return model
    };
}
JCUploadFile.prototype.wxCheeck = function () {
    let _this = this
    return new Promise((resolve)=>{
        wx.chooseImage({
            count: this.fileNum, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                _this.img  = res.localIds
                resolve(_this.img);
            }
        });
    });
}
JCUploadFile.prototype.getImg = function () {
    let _this = this
    return new Promise(resolve => {
        let model = this.judgModel()
        if (model){
            _this.localImg.push(data)
            resolve(_this.localImg)
        } else {
            let promise = Promise.resolve();
            _this.img.forEach((item)=>{
                promise = promise.then(()=>{
                    return new Promise((resolve =>{
                        wx.getLocalImgData({
                            localId: item, // 图片的localID
                            success: function (res) {
                                // localData是图片的base64数据，可以用img标签显示
                                _this.localImg.push(res.localData)
                                resolve(_this.localImg)
                            }
                        });
                    } ))
                })
            })
            promise.then(arr=>{
                resolve(arr)
            })
        }
    })
}
JCUploadFile.prototype.getLocalImg = async function () {
    let resA = await this.wxCheeck()
    let resB = await this.getImg()
    return resB
}
