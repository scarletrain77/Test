class NPCBody extends egret.DisplayObjectContainer {
    public static BODY_H: number;
    public static BODY_W: number;
    private _playerArray: egret.Bitmap[] = [];
    private _timeOnEnterFrame: number = 0;
    private _animFrameEnd: number = 7;
    private _frameNumber: number = 0;
    private _isPlayFirst: boolean = true;
    constructor(name: string, animFrameAll: number) {
        super();
        this._animFrameEnd = animFrameAll - 1;

        var temp = 1;
        for (var i: number = 0; i < animFrameAll; i++) {
            var num: string = "";
            if (temp == 10) {
                temp = 0;
                num = name + "1" + temp.toString() + "_png";
            } else if (temp > 10) {
                num = name + "1" + temp.toString() + "_png";
            } else {
                num = name + "0" + temp.toString() + "_png";
            }
            var tempBit = new egret.Bitmap(RES.getRes(num));
            this._playerArray.push(tempBit);
            temp++;
        }
        NPCBody.BODY_H = this._playerArray[0].height;
        NPCBody.BODY_W = this._playerArray[0].width;
        this.once(egret.Event.ADDED_TO_STAGE, this.onLoad, this);
    }

    private onLoad(event: egret.Event) {
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this._timeOnEnterFrame = egret.getTimer();
    }

    private onEnterFrame(e: egret.Event) {
        if (this._frameNumber >= 1) {
            this.removeChild(this._playerArray[this._frameNumber - 1]);
        } else if (this._frameNumber == 0 && this._isPlayFirst == false) {
            this.removeChild(this._playerArray[this._animFrameEnd]);
        }
        this.addChild(this._playerArray[this._frameNumber]);
        this._frameNumber++;
        if (this._frameNumber == this._animFrameEnd + 1) {
            this._frameNumber = 0;
        }
        this._isPlayFirst = false;
        this._timeOnEnterFrame = egret.getTimer();
        //console.log(this.frameNumber);
    }
}

class Body extends egret.DisplayObjectContainer {
    public static RUN_BODY_H: number;
    public static RUN_BODY_W: number;
    public static IDLE_BODY_H: number;
    public static IDLE_BODY_W: number;
    private _idleArray: egret.Bitmap[] = [];
    private _runArray: egret.Bitmap[] = [];
    private _attackArray: egret.Bitmap[] = [];
    private _timeOnEnterFrame: number = 0;
    //目前所在的帧数，idle一共8帧，即帧数为0-7
    private _frameNumber: number = 0;
    //是不是第一次播放
    private _isPlayFirst: boolean = true;
    //判断状态切换前的是Run状态还是Idle状态
    private _isRunChild: boolean = false;
    private _isIdleChild: boolean = false;
    private _isAttackChild: boolean = false;
    //两个动画的播放起始和结束帧
    private _idleAnimFrameEnd: number = 7;
    private _runAnimFrameEnd: number = 7;
    private _attackAnimFrameEnd: number = 7;
    public mode: string = "Run";

    public constructor(name: string, mode: string, idleFrame: number, runFrame: number, attackFrame: number) {
        super();

        this._idleAnimFrameEnd = idleFrame - 1;
        this._runAnimFrameEnd = runFrame - 1;
        this._attackAnimFrameEnd = attackFrame - 1;

        for (var i = 1; i <= idleFrame; i++) {
            this._idleArray.push(new egret.Bitmap(RES.getRes(name + "idle" + "0" + i + "_png")));
        }
        for (var i = 1; i <= runFrame; i++) {
            this._runArray.push(new egret.Bitmap(RES.getRes(name + "run" + "0" + i + "_png")));
        }
        for (var i = 1; i <= attackFrame; i++) {
            this._attackArray.push(new egret.Bitmap(RES.getRes(name + "attack" + "0" + i + "_png")));
        }

        /*var player01: egret.Bitmap = new egret.Bitmap(RES.getRes(name + "idle01_png"));
        var player02: egret.Bitmap = new egret.Bitmap(RES.getRes(name + "idle02_png"));
        var player03: egret.Bitmap = new egret.Bitmap(RES.getRes(name + "idle03_png"));
        var player04: egret.Bitmap = new egret.Bitmap(RES.getRes(name + "idle04_png"));
        var player05: egret.Bitmap = new egret.Bitmap(RES.getRes(name + "idle05_png"));
        var player06: egret.Bitmap = new egret.Bitmap(RES.getRes(name + "idle06_png"));
        var player07: egret.Bitmap = new egret.Bitmap(RES.getRes(name + "idle07_png"));
        var player08: egret.Bitmap = new egret.Bitmap(RES.getRes(name + "idle08_png"));
        var player09: egret.Bitmap = new egret.Bitmap(RES.getRes(name + "run01_png"));
        var player10: egret.Bitmap = new egret.Bitmap(RES.getRes(name + "run02_png"));
        var player11: egret.Bitmap = new egret.Bitmap(RES.getRes(name + "run03_png"));
        var player12: egret.Bitmap = new egret.Bitmap(RES.getRes(name + "run04_png"));
        var player13: egret.Bitmap = new egret.Bitmap(RES.getRes(name + "run05_png"));
        var player14: egret.Bitmap = new egret.Bitmap(RES.getRes(name + "run06_png"));
        var player15: egret.Bitmap = new egret.Bitmap(RES.getRes(name + "run07_png"));
        var player16: egret.Bitmap = new egret.Bitmap(RES.getRes(name + "run08_png"));
        this.idleArray = [player01, player02, player03, player04, player05, player06, player07, player08];
        this.runArray = [player09, player10, player11, player12, player13, player14, player15, player16];*/

        this.mode = mode;
        Body.RUN_BODY_W = this._idleArray[0].width;
        Body.RUN_BODY_H = this._idleArray[0].height;
        Body.RUN_BODY_W = this._runArray[0].width;
        Body.RUN_BODY_H = this._runArray[0].height;
        this.once(egret.Event.ADDED_TO_STAGE, this.onLoad, this);
    }

    public reset(): void {
        this._isPlayFirst = true;
        if (this._frameNumber == 0) {
            this._frameNumber = 8;
        }
        if (this._isIdleChild == true) {
            this.removeChild(this._idleArray[this._frameNumber - 1]);
            //console.log("remove idle"+ this.frameNumber);
        } else if (this._isRunChild == true) {
            this.removeChild(this._runArray[this._frameNumber - 1]);
            //console.log("remove run" + this.frameNumber);
        } else if (this._isAttackChild == true) {
            this.removeChild(this._attackArray[this._frameNumber - 1]);
        }
        this._isIdleChild = false;
        this._isRunChild = false;
        this._isAttackChild = false;
        this._frameNumber = 0;
    }

    private onLoad(event: egret.Event) {
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this._timeOnEnterFrame = egret.getTimer();
    }
    private onEnterFrame(e: egret.Event) {
        //帧数大于0的时候，才能移除前一帧
        //当帧数为0的时候，移除的是最后一帧
        //第一次播放的时候，第0帧前面没有要移除的第7帧
        if (this.mode == "Idle") {
            if (this._frameNumber >= 1) {
                this.removeChild(this._idleArray[this._frameNumber - 1]);
            } else if (this._frameNumber == 0 && this._isPlayFirst == false) {
                this.removeChild(this._idleArray[this._idleAnimFrameEnd]);
            }
            this.addChild(this._idleArray[this._frameNumber]);
            this._isIdleChild = true;
            this._frameNumber++;
            if (this._frameNumber == this._idleAnimFrameEnd + 1) {
                this._frameNumber = 0;
            }
            this._isPlayFirst = false;
            this._timeOnEnterFrame = egret.getTimer();
            //console.log(this.frameNumber);
        } else if (this.mode == "Run") {
            //console.log("Run:"+this.frameNumber);
            if (this._frameNumber >= 1) {
                this.removeChild(this._runArray[this._frameNumber - 1]);
            } else if (this._frameNumber == 0 && this._isPlayFirst == false) {
                this.removeChild(this._runArray[this._runAnimFrameEnd]);
            }
            this.addChild(this._runArray[this._frameNumber]);
            this._isRunChild = true;
            this._frameNumber++;
            if (this._frameNumber == this._runAnimFrameEnd + 1) {
                this._frameNumber = 0;
            }
            this._isPlayFirst = false;
            this._timeOnEnterFrame = egret.getTimer();
        } else if (this.mode == "Attack") {
            if (this._frameNumber >= 1) {
                this.removeChild(this._attackArray[this._frameNumber - 1]);
            } else if (this._frameNumber == 0 && this._isPlayFirst == false) {
                this.removeChild(this._attackArray[this._attackAnimFrameEnd]);
            }
            this.addChild(this._attackArray[this._frameNumber]);
            this._isAttackChild = true;
            this._frameNumber++;
            if (this._frameNumber == this._attackAnimFrameEnd + 1) {
                this._frameNumber = 0;
            }
            this._isPlayFirst = false;
            this._timeOnEnterFrame = egret.getTimer();
        }
    }
}
