import React, { Component } from 'react';
import * as mqtt from 'mqtt';

const host = 'broker.hivemq.com'
const port = '8000'
const clientId = `mqttItera_${Math.random().toString(16).slice(3)}`


const connectUrl = `ws://${host}:${port}/mqtt`;

const client = mqtt.connect(connectUrl, {
  clientId,
  keepalive: 30,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  connectTimeout: 30 * 1000,
  rejectUnauthorized: false,

  //uncomment if need username or password
  //   username: 'emqx',
  //   password: 'public',
  reconnectPeriod: 1000,
})

const subtopic = '/+/mqtt'
client.on('connect', () => {
  console.log('Connected')
  client.subscribe([subtopic], () => {
    console.log(`Subscribe to topic '${subtopic}'`)
  })
})

class App extends Component {
  state = {
    time: new Date(Date.now()).toString(),
    dataSuhu: {}
  };
  IoTmessage() {
    client.on('message', (topic, payload) => {
      console.log('Received Message:', topic, payload.toString())
      let data = JSON.parse(payload.toString())

      this.setState({
        dataSuhu: {
          data: data.data,
          tanggal: data.tanggal
        }
      })

    })
  }

  render() {
    return (
      <div className="container">
        <h1>{this.state.time}</h1>
        <h2>Data sensor : {this.state.dataSuhu.data}</h2>
        <h2>tanggal update : {this.state.dataSuhu.tanggal}</h2>
      </div>
    );
  }

  componentDidUpdate() {

  }
  async componentDidMount() {
    this.IoTmessage();
    // update waktu per detik
    this.interval = setInterval(() => this.setState({ time: new Date(Date.now()).toString() }), 1000);


    //contoh update data dummy per detik
    // this.updateDataSuhu = setInterval(() => {




    //   console.log("update data")
    //   this.setState({
    //     dataSuhu: {
    //       data: Math.floor(Math.random() * (20 - 10) + 30),
    //       tanggal: new Date(Date.now()).toString()
    //     }
    //   })
    // }, 1000);
  }
  componentWillUnmount() {

    // prevent memory leak
    clearInterval(this.interval)
    // clearInterval(this.updateDataSuhu)

    client.unsubscribe(subtopic, console.log("unsubscribe"))
  }

}

export default App;