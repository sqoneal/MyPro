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
export default class NewClass extends cc.Component {

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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    clearCoin() {
        for (var i = 0; i < this.tmpCoin.length; i++) {
            this.tmpCoin[i].removeFromParent(true);
        }
    }

    newCoin(coinNum: number) {
        this.clearCoin();
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

    XiaZhu() {
        var self = this;
        self.buttonNumArr[0].node.on(cc.Node.EventType.TOUCH_START, function () {
            self.ShakeCup();
            self.newCoin(1);
            self.UpCup();
        });
        self.buttonNumArr[1].node.on(cc.Node.EventType.TOUCH_START, function () {
            self.ShakeCup();
            self.newCoin(2);
            self.UpCup();
        });
        self.buttonNumArr[2].node.on(cc.Node.EventType.TOUCH_START, function () {
            self.ShakeCup();
            self.newCoin(4);
            self.UpCup();
        });
        self.buttonNumArr[3].node.on(cc.Node.EventType.TOUCH_START, function () {
            self.ShakeCup();
            self.newCoin(10);
            self.UpCup();
        });
    }

    UpCup() {
        this.schedule(function () {
            var moveup = cc.moveBy(1, cc.p(0, 50));
            this.cup.runAction(moveup);
        }, 1, 1, 4);
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
        var randNum = [];
        for (var i = 0; i < 3; i++) {
            randNum[i] = Math.ceil(cc.random0To1() * 5 + 1);
            cc.log("" + randNum[i]);
            var realUrl = cc.url.raw("Texture/s" + randNum[i] + ".png");
            var texture = cc.textureCache.addImage(realUrl, function () { }, this);
            this.spriteTouziArr[i].spriteFrame.setTexture(texture);
        }

    }

    start() {
        this.XiaZhu();
    }

    // update (dt) {}
}
