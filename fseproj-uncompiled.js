let biggest = 0
let count = 0
function startup() {
    motors.largeBC.setPauseOnRun(true);
    front = sensors.ultrasonic3.distance()
    brick.showString("frontDist: " + front.toString(), 1)
    turn90(true);
    left = sensors.ultrasonic3.distance()
    brick.showString("leftDist: " + left.toString(), 2)
    turn90(true);
    back = sensors.ultrasonic3.distance()
    brick.showString("backDist: " + back.toString(), 3)
    turn90(true);
    right = sensors.ultrasonic3.distance()
    brick.showString("rightDist: " + right.toString(), 4)
    turn90(true);
    biggest = Math.max(Math.max(front, right), Math.max(back, left))
    if (biggest == left) {
        turn90(true);
    } else if (biggest == back) {
        turn90(true);
        turn90(true);
    } else if (biggest == right) {
        turn90(false);
    } else if (biggest == front) {
        null
    }
    music.playSoundEffect(sounds.expressionsLaughing2)
    motors.largeBC.setPauseOnRun(false);
}
function moveForward() {
    motors.largeBC.tank(50, 50)
}
function pickUp() {
    // this asumes the arm is always in the "up" position
    motors.mediumA.clearCounts()
    count = motors.mediumA.angle()
    motors.mediumA.run(-50, 360)
    // possibly configure a second medium motor to pinch
    // the brick?
    motors.mediumA.run(50, 360)
}
function dropOff() {
    count = motors.mediumA.angle()
    motors.mediumA.run(50, count - 360)
    motors.mediumA.run(-50, count + 360)
}
function scan() {
    motors.mediumD.setPauseOnRun(false)
    // the sensor motor is plugged into motor port D, it's
    // loosely connected so be careful
    motors.mediumD.run(25, 180)
    motors.mediumD.run(25, -360)
    // resetting the motor back to 0
    motors.mediumD.run(25, 180)
}
let pickup = false
let front = 0
let start = false
let left = 0
let back = 0
let right = 0
// setting the mode for the color sensor
sensors.color1.setMode(ColorSensorMode.Color);
motors.mediumA.run(100, 360)
motors.largeBC.setPauseOnRun(false)
motors.resetAll()
sensors.gyro4.reset()
// Left = true, right = false
function turn90(direction: boolean) {
    if (direction) {
        let angle = sensors.gyro4.angle() - 80;

        //left is negative on the gyro
        while (sensors.gyro4.angle() > angle) {
            motors.largeBC.tank(-35, 35);
        }
        motors.largeBC.stop();
    } else {
        let angle = sensors.gyro4.angle() + 80;
        while (sensors.gyro4.angle() < angle) {
            motors.largeBC.tank(35, -35);
        }
        motors.largeBC.stop();
    }

}
forever(function () {
    brick.clearScreen()
    start = brick.buttonEnter.isPressed()
    brick.showString(sensors.gyro4.angle().toString(), 10)
    if (brick.buttonDown.isPressed()) {
        sensors.gyro4.reset()
    }
    switch (sensors.
        color1.color()) {
        case ColorSensorColor.Red:
            brick.showString("RED!", 1)
            if (pickup) {
                dropOff();
                pickup = false
            }

            break;

        case ColorSensorColor.Green:
            brick.showString("GREEN!!!", 1);
            brick.showString("PICKING UP!", 2);
            if (!(pickup)) {
                pickUp();
                pickup = true
            }

            break;
        case ColorSensorColor.Yellow:
            brick.showString("YELLOW!", 1);
            //don't remember what I need to do for this
            break;

        case ColorSensorColor.Blue:
            brick.showString("BLUE", 1);
            //same here.
            break;
    }
    if (start = true) {
        startup();
        start = false;
    }
    while (sensors.ultrasonic3.distance() > 20) {
        moveForward();
    }
    if (sensors.ultrasonic3.distance() < 20) {
        motors.stopAll();
        brick.exitProgram();
    }
    pause(100);


})
