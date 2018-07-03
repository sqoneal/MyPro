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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    XiaZhu() {
        var self = this;
        self.buttonNumArr[0].node.on(cc.Node.EventType.TOUCH_START, function () {
            self.ShakeCup();
        });
        self.buttonNumArr[1].node.on(cc.Node.EventType.TOUCH_START, function () {
            self.ShakeCup();
        });
        self.buttonNumArr[2].node.on(cc.Node.EventType.TOUCH_START, function () {
            self.ShakeCup();
        });
        self.buttonNumArr[3].node.on(cc.Node.EventType.TOUCH_START, function () {
            self.ShakeCup();
        });
    }

    ShakeCup() {
        this.cup.setPosition(cc.p(-1,-179));
        var rot = 10;
        var i = 0;
        var step = 2;
        var count = 0;
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

        this.schedule(function () {
            var moveup = cc.moveTo(1, cc.p(this.cup.getPositionX(), this.cup.getPositionY() + 50));
            this.cup.runAction(moveup);
        }, 1, 1, 4);

    }

    RandomTouzi() {
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
