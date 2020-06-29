const uuid = "0000fd6f-0000-1000-8000-00805f9b34fb";

const buttonScan = document.getElementById('ble-scan-button');
const output = document.getElementById('output');

buttonScan.addEventListener( 'click', function () {
	onButtonClick();
} );

async function onButtonClick() {
  try {
    const scan = await navigator.bluetooth.requestLEScan({filters: [{services: [uuid]}]});

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
      event.manufacturerData.forEach((valueDataView, key) => {
        console.logDataView('Manufacturer', key, valueDataView);
      });
      event.serviceData.forEach((valueDataView, key) => {
        logDataView('Service', key, valueDataView);
      });
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

/* Utils */

const logDataView = (labelOfDataSource, key, valueDataView) => {
  const hexString = [...new Uint8Array(valueDataView.buffer)].map(b => {
    return b.toString(16).padStart(2, '0');
  }).join(' ');
  let text = `  ${labelOfDataSource} Data: ` + key +
      '\n    (Hex) ' + hexString;
  console.log(text);
  output.innerHTML = text + output.innerHTML;
};