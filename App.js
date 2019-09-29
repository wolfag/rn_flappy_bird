/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Text
} from 'react-native';
import Matter from 'matter-js'
import { GameEngine } from 'react-native-game-engine'

import Constants from './src/common/index';
import Bird from './src/components/Bird';
import Physics from './src/components/Physics';
import Wall from './src/components/Wall';

import { generatePipes } from './src/utils'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      running: true
    }

    this.gameEngine = null;

    this.entities = this._setupWorld()
  }

  _setupWorld = () => {
    const engine = Matter.Engine.create({ enableSleeping: false })
    const world = engine.world;
    const bird = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 4, Constants.MAX_HEIGHT / 2, 50, 50)
    const floor = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT - 25, Constants.MAX_WIDTH, 50, { isStatic: true })
    const ceiling = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, 25, Constants.MAX_WIDTH, 50, { isStatic: true })

    const [pipe1Height, pipe2Height] = generatePipes()
    const pipe1 = Matter.Bodies.rectangle(Constants.MAX_WIDTH - (Constants.PIPE_WIDTH / 2), pipe1Height / 2, Constants.PIPE_WIDTH, pipe1Height, { isStatic: true });
    const pipe2 = Matter.Bodies.rectangle(Constants.MAX_WIDTH - (Constants.PIPE_WIDTH / 2), Constants.MAX_HEIGHT - (pipe2Height / 2), Constants.PIPE_WIDTH, pipe2Height, { isStatic: true });

    const [pipe3Height, pipe4Height] = generatePipes();

    const pipe3 = Matter.Bodies.rectangle(Constants.MAX_WIDTH * 2 - (Constants.PIPE_WIDTH / 2), pipe3Height / 2, Constants.PIPE_WIDTH, pipe3Height, { isStatic: true });
    const pipe4 = Matter.Bodies.rectangle(Constants.MAX_WIDTH * 2 - (Constants.PIPE_WIDTH / 2), Constants.MAX_HEIGHT - (pipe4Height / 2), Constants.PIPE_WIDTH, pipe4Height, { isStatic: true });

    Matter.World.add(world, [bird, floor, ceiling, pipe1, pipe2, pipe3, pipe4])

    Matter.Events.on(engine, 'collisionStart', event => {
      const pairs = event.pairs;
      this.gameEngine.dispatch({ type: 'game-over' })
    })

    return {
      physics: { engine, world },
      bird: { body: bird, size: [50, 50], color: 'red', renderer: Bird },
      floor: { body: floor, size: [Constants.MAX_WIDTH, 50], color: 'brown', renderer: Wall },
      ceiling: { body: ceiling, size: [Constants.MAX_WIDTH, 50], color: 'blue', renderer: Wall },
      pipe1: { body: pipe1, size: [Constants.PIPE_WIDTH, pipe1Height], color: "green", renderer: Wall },
      pipe2: { body: pipe2, size: [Constants.PIPE_WIDTH, pipe2Height], color: "green", renderer: Wall },
      pipe3: { body: pipe3, size: [Constants.PIPE_WIDTH, pipe3Height], color: "green", renderer: Wall },
      pipe4: { body: pipe4, size: [Constants.PIPE_WIDTH, pipe4Height], color: "green", renderer: Wall }
    }
  }

  _onEvent = e => {
    if (e.type === 'game-over') {
      this.setState({ running: false })
    }
  }

  _reset = () => {
    this.gameEngine.swap(this._setupWorld());
    this.setState({
      running: true
    })
  }

  render() {
    const { running } = this.state;
    return (
      <View style={styles.container}>
        <GameEngine ref={(ref) => { this.gameEngine = ref }}
          style={styles.gameContainer}
          running={running}
          systems={[Physics]}
          entities={this.entities}
          onEvent={this._onEvent}
        >
          <StatusBar hidden={true} />
        </GameEngine>
        {!running && (
          <TouchableOpacity
            style={styles.fullScreenButton}
            onPress={this._reset}>
            <View style={styles.fullScreen}>
              <Text style={styles.gameOverText}>Game Over</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  gameOverText: {
    color: 'white',
    fontSize: 48
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullScreenButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1
  }
});

