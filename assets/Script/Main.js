var MoveState = cc.Enum({
    Left: 1,
    Right: -1,
});

var buttonGap = 0;
var steps = 0;
var totalWin = 0;
var totalSteps = 0;
var targetName = "ROBIN";

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
        ScoresLabel: {
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
        cc.log("Swapping: " + onesIndex + " and " + anothersIndex);
        var actionTarget = cc.moveTo(0.3, another.getPosition());
        var actionAnother = cc.moveTo(0.3, one.getPosition());
        // swap child indexes
        this.node.children[onesIndex] = another;
        this.node.children[anothersIndex] = one;

        one.runAction(actionTarget);
        another.runAction(actionAnother);

        this.GameState = (this.GameState === MoveState.Left) ? MoveState.Right : MoveState.Left;
        this.StepsLabel.string = "Current steps: " + ++steps;
        this.StateLabel.string = (this.GameState === MoveState.Left) ? "Left" : "Right";
        if(this.isWin()){
            totalSteps += steps;
            steps = 0;
            this.ScoresLabel.string = "Total Win: " + ++totalWin + " || Total Steps: " + totalSteps;
            if(totalWin % 2 !== 0){
                targetName = "NIROB";
            } else {
                targetName = "ROBIN";
            }
            // TODO reposition not working for unknown reason
            // var i;
            // var n = this.node.childrenCount - 1;
            // for(i = 0; i < n; i++){
            //     var randomLetter = i + (Math.random() * (n - i));
            //     randomLetter = parseInt(randomLetter);
            //     var tmp = this.node.children[i];
            //     this.node.children[i] = this.node.children[randomLetter];
            //     this.node.children[randomLetter] = tmp;
            //
            //     var action1 = cc.moveTo(0,this.node.children[i].getPosition());
            //     var action2 = cc.moveTo(0,this.node.children[randomLetter].getPosition());
            //
            //     this.node.children[randomLetter].runAction(action1);
            //     this.node.children[i].runAction(action2);
            // }
        }
    },

    shuffleLetters: function () {
        var i;
        var n = this.node.childrenCount - 1;
        for(i = 0; i < n + 1; i++){
            var randomLetter = i + (Math.random() * (n - i));
            if(i === n) randomLetter = Math.random() * n - 1;
            randomLetter = parseInt(randomLetter);
            // swap
            var tmp = this.node.children[i];
            this.node.children[i] = this.node.children[randomLetter];
            this.node.children[randomLetter] = tmp;
        }
        this.node.children.forEach(this.setButtonPositions);
    },

    setButtonPositions: function (item, index) {
        cc.log("Index: " + buttonGap * (index - 2));
        item.setPosition(buttonGap * (index - 2), 0);
    },

    getCurrentWord: function(){
        var str = "";
        var i;
        for(i = 0; i < this.node.childrenCount; i++){
            str += this.node.children[i].name;
        }
        return str;
    },

    isWin: function(){
        return this.getCurrentWord() === targetName;
    }
});
