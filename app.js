const uuid = "0000fd6f-0000-1000-8000-00805f9b34fb";

const buttonScan = document.getElementById('ble-scan-button');
const buttonStop = document.getElementById('ble-stop-button');
const textUsersNum = document.getElementById('text-usersnum');
const tableUsers = document.getElementById('table-users');

let scan;

buttonScan.addEventListener( 'click', onButtonClick);
buttonStop.addEventListener( 'click', stopScan);

async function onButtonClick() {
  try {
    scan = await navigator.bluetooth.requestLEScan({filters: [{services: [uuid]}]});

    let users = [];

    console.log('Scan started with:');
    console.log(' acceptAllAdvertisements: ' + scan.acceptAllAdvertisements);
    console.log(' active: ' + scan.active);
    console.log(' keepRepeatedDevices: ' + scan.keepRepeatedDevices);
    console.log(' filters: ' + JSON.stringify(scan.filters));

    navigator.bluetooth.addEventListener('advertisementreceived', event => {
      console.log('Advertisement received.');
      console.log('  Device Name: ' + event.device.name);
      console.log('  Device ID: ' + event.device.id);
      console.log('  RSSI: ' + event.rssi);
      console.log('  TX Power: ' + event.txPower);
      console.log('  UUIDs: ' + event.uuids);

      let index = users.findIndex((u) => u.id == [event.device.id]);

      if(index < 0){
        users.push({id: event.device.id, rssi: event.rssi});

        let newRow = tableUsers.insertRow();
        let newCell = newRow.insertCell();
        let newText = document.createTextNode(users.length);
        newCell.appendChild(newText);

        newCell = newRow.insertCell();
        newText = document.createTextNode(event.device.id);
        newCell.appendChild(newText);

        newCell = newRow.insertCell();
        newText = document.createTextNode(event.rssi);
        newCell.appendChild(newText);
      } else {
        users[index]['rssi'] = event.rssi;
        tableUsers.rows[index+1].cells[2].innerHTML = event.rssi;
      }

      textUsersNum.innerHTML = users.length + ' counts!';

      // updateTables(users);
    });

  } catch(error)  {
    console.log('Argh! ' + error);
  }
}

function stopScan() {
  console.log('Stopping scan...');
  scan.stop();
  console.log('Stopped.  scan.active = ' + scan.active);
}