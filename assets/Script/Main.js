var MoveState = cc.Enum({
    Left: 1,
    Right: -1,
});

var buttonGap = 0;
var steps = 0;

cc.Class({
    extends: cc.Component,

    properties: {
        GameState: {
            "default": MoveState.Left,
            type: MoveState,
        },
        StateLabel: {
            default: null,
            type: cc.Label,
        },
        StepsLabel: {
            default: null,
            type: cc.Label,
        },
    },

    start : function () {
        this.initEnvironment();
    },

    initEnvironment : function(){
        var size = cc.winSize;
        var height = size.height;
        var width = size.width;
        var ratio = width / height;
        var isLandscape = ratio > 1;

        var buttonSize = width * 0.12;
        buttonGap = width * 0.16;

        if(this.node.x !== 0 || this.node.y !== 0){
            cc.error("MainBoard is not centered");
        }
        function setButtons(item, index) {
            item.width = item.height = buttonSize;
            item.setPosition(buttonGap * (index - 2), 0);
            cc.log(item.getPosition().x + " : " + item.getPosition().y);
        }
        this.node.children.forEach(setButtons);

        this.shuffleLetters();
    },

    toggleState : function(event, customEventData){
        var stateFactor = this.GameState === MoveState.Left ? -1 : 1; // TODO retrieve the enum value

        var onesIndex = this.node.children.indexOf(event.target);
        var anothersIndex = onesIndex + stateFactor;
        if(anothersIndex === -1){
            anothersIndex = 4;
        } else if(anothersIndex === 5){
            anothersIndex = 0;
        }
        var one = event.target;
        var another = this.node.children[anothersIndex];

        var actionTarget = cc.moveTo(0.3, another.getPosition());
        var actionAnother = cc.moveTo(0.3, one.getPosition());
        // swap child indexes
        this.node.children[onesIndex] = another;
        this.node.children[anothersIndex] = one;

        one.runAction(actionTarget);
        another.runAction(actionAnother);

        this.GameState = (this.GameState === MoveState.Left) ? MoveState.Right : MoveState.Left;
        this.StepsLabel.string = "Steps: " + ++steps;
        this.StateLabel.string = (this.GameState === MoveState.Left) ? "Left" : "Right";
    },

    shuffleLetters: function () {
        var i;
        var n = this.node.childrenCount - 1;
        for(i = 0; i < n + 1; i++){
            var randomLetter = i + (Math.random() * (n - i));
            if(i === n) randomLetter = Math.random() * n - 1;
            randomLetter = parseInt(randomLetter);
            cc.log("Random Letter : " + randomLetter);
            // swap
            var tmp = this.node.children[i];
            var tmp2 = this.node.children[randomLetter]; // TODO optimize this swap
            this.node.children[i] = tmp2;
            this.node.children[randomLetter] = tmp;
        }

        this.node.children.forEach(this.setButtonPositions);
    },
    setButtonPositions: function (item, index) {
        item.setPosition(buttonGap * (index - 2), 0);
    }
});
