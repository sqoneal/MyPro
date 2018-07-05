// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameLogic extends cc.Component {
    private selectSide: String = null;
    public static BIG: String = "BIG";
    public static SMALL: String = "SMALL";
    private touziResult: number = 0;
    private randNum: number[] = [];
    private myScore: number = 1000;
    private touzhuScore: number = 0;
    private cupstatus: boolean = true;//true为杯子没起来，false为杯子已经起来

    @property([cc.Button])
    buttonNumArr: Array<cc.Button> = [];

    @property([cc.Sprite])
    spriteTouziArr: Array<cc.Sprite> = [];

    @property(cc.Node)
    cup: cc.Node = null;

    @property(cc.Prefab)
    coin: cc.Prefab = null;

    //临时保存coin复制生成的预制资源，用于定位重新删除节点
    @property([cc.Node])
    tmpCoin: Array<cc.Node> = [];

    @property(cc.Button)
    buttonReset: cc.Button = null;

    @property(cc.Label)
    labelScore: cc.Label = null;

    @property(cc.Label)
    labelTips: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    resetGame() {
        this.selectSide = null;
        this.touziResult = 0;
        this.clearCoin();
        this.ShakeCup();
        this.labelTips.string = "请选择大小";
        this.cupstatus = true;
    }

    //监听玩家买大小
    setSelectSide() {
        this.ShakeCup();
        var self = this;
        var listener = cc.EventListener.create({
            event: 1,//1 ==>cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: (touches, event) => {
                var target = event.getCurrentTarget();//获取事件所绑定的target
                var locationInNode = target.convertToNodeSpace(touches.getLocation());
                if (locationInNode.x < 150 && locationInNode.y < 190 && locationInNode.y > 100) {
                    if (!self.cupstatus) {
                        self.labelTips.string = "请重新摇骰";
                        return 0;
                    }
                    cc.log("买小");
                    this.labelTips.string = "请投注";
                    self.selectSide = GameLogic.SMALL;
                }
                if (locationInNode.x > 150 && locationInNode.y < 190 && locationInNode.y > 100) {
                    if (!self.cupstatus) {
                        self.labelTips.string = "请重新摇骰";
                        return 0;
                    }
                    cc.log("买大");
                    this.labelTips.string = "请投注";
                    self.selectSide = GameLogic.BIG;
                }
                return true;
            },
        });

        cc.eventManager.addListener(listener, this.node);
    }

    clearCoin() {
        for (var i = 0; i < this.tmpCoin.length; i++) {
            this.tmpCoin[i].removeFromParent(true);
        }
    }

    newCoin(coinNum: number) {
        this.clearCoin();
        if (this.selectSide == GameLogic.SMALL) {
            for (var i = 0; i < coinNum; i++) {
                var newCoin = cc.instantiate(this.coin);
                this.node.addChild(newCoin);
                //临时保存coin复制生成的预制资源
                this.tmpCoin[i] = newCoin;
                newCoin.setPosition(-132, 214);
                let dropdown = cc.moveTo(1 + i * 0.3, cc.p(newCoin.getPositionX() + 10, newCoin.getPositionY() - 320 + (i * 10))).easing(cc.easeCubicActionInOut());
                newCoin.runAction(dropdown);
            }
        }
        if (this.selectSide == GameLogic.BIG) {
            for (var i = 0; i < coinNum; i++) {
                var newCoin = cc.instantiate(this.coin);
                this.node.addChild(newCoin);
                //临时保存coin复制生成的预制资源
                this.tmpCoin[i] = newCoin;
                newCoin.setPosition(-132, 214);
                let dropdown = cc.moveTo(1 + i * 0.3, cc.p(newCoin.getPositionX() + 250, newCoin.getPositionY() - 320 + (i * 10))).easing(cc.easeCubicActionInOut());
                newCoin.runAction(dropdown);
            }
        }
    }

    XiaZhu() {
        var self = this;
        self.buttonNumArr[0].node.on(cc.Node.EventType.TOUCH_START, function () {
            if (self.selectSide !== null && self.cupstatus) {
                self.newCoin(1);
                self.touzhuScore = 100;
                self.myScore -= self.touzhuScore;
                self.labelScore.string = self.myScore.toString();
                self.UpCup();
            }
        });
        self.buttonNumArr[1].node.on(cc.Node.EventType.TOUCH_START, function () {
            if (self.selectSide !== null && self.cupstatus) {
                self.newCoin(2);
                self.touzhuScore = 200;
                self.myScore -= self.touzhuScore;
                self.labelScore.string = self.myScore.toString();
                self.UpCup();
            }
        });
        self.buttonNumArr[2].node.on(cc.Node.EventType.TOUCH_START, function () {
            if (self.selectSide !== null && self.cupstatus) {
                self.newCoin(4);
                self.touzhuScore = 400;
                self.myScore -= self.touzhuScore;
                self.labelScore.string = self.myScore.toString();
                self.UpCup();
            }
        });
        self.buttonNumArr[3].node.on(cc.Node.EventType.TOUCH_START, function () {
            if (self.selectSide !== null && self.cupstatus) {
                self.newCoin(10);
                self.touzhuScore = self.myScore;
                self.myScore -= self.touzhuScore;
                self.labelScore.string = self.myScore.toString();
                self.UpCup();
            }
        });
    }

    UpCup() {
        this.cupstatus = false;
        let win = false;
        var self = this;
        this.schedule(function () {
            var moveup = cc.moveBy(1, cc.p(0, 50));
            var setscore = cc.callFunc(function () {
                self.labelScore.string = self.myScore.toString();
                if (win) {
                    self.labelTips.string = "你赢了";
                } else {
                    self.labelTips.string = "你输了，请重来";
                }
            }, self);
            /*var gameover = cc.callFunc(function () {
                if (self.myScore == 0) {
                    cc.director.preloadScene("SceneOver");
                    cc.director.loadScene("SceneOver");
                }
            }, self);*/

            self.schedule(function () {
                if (self.myScore == 0) {
                    cc.director.preloadScene("SceneOver");
                    cc.director.loadScene("SceneOver");
                }
            }, 1, 1, 3);

            var seq = cc.sequence(moveup, setscore);
            self.cup.runAction(seq);
        }, 1, 1, 4);

        if (this.touziResult >= 11) {
            if (this.selectSide == GameLogic.BIG) {
                this.myScore += this.touzhuScore * 2;
                win = true;
            } else {
                win = false;
            }
        } else {
            if (this.selectSide == GameLogic.SMALL) {
                this.myScore += this.touzhuScore * 2;
                win = true;
            } else {
                win = false;
            }
        }

        this.selectSide == null;//把选择大小状态重置
    }

    ShakeCup() {
        //复位骰盅位置
        this.cup.setPosition(cc.p(-1, -179));
        //骰盅摇动的角度大小
        var rot = 10;
        //临时控制变量
        var i = 0;
        var count = 0;
        //骰盅摇动的步伐--速度
        var step = 2;
        //骰盅来回摇动的次数
        var shakecount = 100;
        this.RandomTouzi();

        this.schedule(function () {
            count++;
            if (i < rot) {
                i = i + step;
                this.cup.rotation = i;
                if (i >= rot) {
                    rot = -rot;
                }
            }
            if (i > rot) {
                i = i - step;
                this.cup.rotation = i;
                if (i <= rot) {
                    rot = -rot;
                }
            }
            if (count >= shakecount) {
                this.cup.rotation = 0;
            }
        }, 0.0002, shakecount);

        /*this.schedule(function () {
            var moveup = cc.moveTo(1, cc.p(this.cup.getPositionX(), this.cup.getPositionY() + 50));
            this.cup.runAction(moveup);
        }, 1, 1, 4);*/
    }

    RandomTouzi() {
        //保存的三个骰子摇出的随机数值
        for (var i = 0; i < 3; i++) {
            this.randNum[i] = Math.ceil(cc.random0To1() * 5 + 1);

            var realUrl = cc.url.raw("/Texture/s" + this.randNum[i] + ".png");
            var texture = cc.textureCache.addImage(realUrl, function () { }, this);
            cc.log("" + texture.url);
            this.spriteTouziArr[i].spriteFrame.setTexture(texture);
        }
        this.touziResult = this.randNum[0] + this.randNum[1] + this.randNum[2];
        cc.log("结果：" + this.touziResult);
    }

    start() {
        this.resetGame();
        this.setSelectSide();
        this.XiaZhu();
        this.labelScore.string = this.myScore.toString();
        this.labelTips.string = "请选择大小";

        var self = this;
        this.buttonReset.node.on(cc.Node.EventType.TOUCH_START, function () { self.resetGame(); });
    }

    // update (dt) {}
}
