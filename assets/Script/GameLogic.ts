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
        var rot = 20;
        var i = 0;
        this.schedule(function () {
            if (i < rot) {
                i++
                this.cup.rotation = i;
                if (i == rot) {
                    rot = -20;
                }
            }
            if (i > rot) {
                i--;
                this.cup.rotation = i;
                if (i == rot) {
                    rot = 20;
                }
            }

        }, 0.0002);
    }

    start() {
        this.XiaZhu();
    }

    // update (dt) {}
}
