const uuid = "0000fd6f-0000-1000-8000-00805f9b34fb";

const buttonScan = document.getElementById('ble-scan-button');
const textUsersNum = document.getElementById('text-usersnum');
const tableUsers = document.getElementById('table-users');

buttonScan.addEventListener( 'click', function () {
	onButtonClick();
} );

async function onButtonClick() {
  try {
    const scan = await navigator.bluetooth.requestLEScan({filters: [{services: [uuid]}]});

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
    });

    setTimeout(stopScan, 10000);
    function stopScan() {
      console.log('Stopping scan...');
      scan.stop();
      console.log('Stopped.  scan.active = ' + scan.active);
    }
  } catch(error)  {
    console.log('Argh! ' + error);
  }
}