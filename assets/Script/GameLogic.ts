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

    @property(cc.Node)
    cup: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    XiaZhu() {
        var self = this;
        for (var i = 0; i < self.buttonNumArr.length; i++) {
            self.buttonNumArr[i].node.on(cc.Node.EventType.TOUCH_START, function () {
                for (var j = 0; j < self.buttonNumArr.length; j++) {
                    self.buttonNumArr[j].enabled = false;
                }
                self.ShakeCup();
            });
        }
    }

    ShakeCup() {
        var rot = 10;
        var i = 0;
        var step = 2;
        var count = 0;
        var shakecount = 100;
        this.schedule(function () {
            count++;
            if (i < rot) {
                i=i+step;
                this.cup.rotation = i;
                if (i >= rot) {
                    rot = -rot;
                }
            }
            if (i > rot) {
                i=i-step;
                this.cup.rotation = i;
                if (i <= rot) {
                    rot = -rot;
                }
            }
            if(count >= shakecount){
                this.cup.rotation = 0;
            }
        }, 0.0002,shakecount);
    }

    start() {
        this.XiaZhu();
    }

    // update (dt) {}
}
