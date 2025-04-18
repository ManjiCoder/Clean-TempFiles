console.log('Jai Shree Ram');
const path = require('path');
const fs = require('fs');
const os = require('os');
const readline = require('readline');

/***************************************************
 * Step 1: Get Data => totalFiles, totalSize & filePathArr
 * Step 2: Check for Empty Folder & Remove it
 * Step 3: Deletion of filePathArr
 ***************************************************/
const processData = (dirPath, data) => {
  fs.readdirSync(dirPath).forEach((file) => {
    const pwd = path.join(dirPath, file);
    const pwdInfo = fs.statSync(pwd);
    if (pwdInfo.isDirectory()) {
      const isEmptyDir = fs.readdirSync(pwd).length === 0;
      if (isEmptyDir) {
        // Removing
        fs.rmSync(pwd, { recursive: true, force: true });
        // Updating in data
        data.files += 1;
        data.size += pwdInfo.size;
      } else {
        processData(pwd, data);
      }
    } else {
      // Updating in data & will process deletion later when no of files is done
      data.size += pwdInfo.size;
      data.files += 1;
      data.filePathArr.push(pwd);
    }
  });

  return data;
};
const processExit = () => {
  let timeToExit = 10;
  if (process.stdin.isTTY) {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (_, key) => {
      if (key.name === 'escape' || key.name === 'return') {
        process.exit(0);
      }
    });
    const intervalId = setInterval(() => {
      process.stdout.write(
        `\nPress Esc or Enter to exit. Auto Exit begin in ${timeToExit}sec`
      );
      timeToExit--;
      if (timeToExit < 0) {
        clearInterval(intervalId);
        process.stdout.write('\n');
        process.exit(0);
      }
    }, 1000);
  } else {
    timeToExit = 5;

    const intervalId = setInterval(() => {
      process.stdout.write(
        `\nPress Esc or Enter to exit. Auto Exit begin in ${timeToExit}sec`
      );
      timeToExit--;
      if (timeToExit < 0) {
        clearInterval(intervalId);
        process.stdout.write('\n');
        process.exit(0);
      }
    }, 1000);
    console.log('Not running in a TTY terminal.');
  }
};

const main = () => {
  // Timer Start
  const t1 = performance.now();

  const dirArr = [os.tmpdir()];

  // Only For Windows
  if (os.platform() === 'win32') {
    const isEmptyDir = fs.readdirSync('C:\\Windows\\Temp').length === 0;
    if (!isEmptyDir) {
      dirArr.push('C:\\Windows\\Temp');
    }
  }

  // Data to track records
  const data = {
    files: 0,
    size: 0,
    filePathArr: [],
    deletedFiles: 0,
    failedToRemoveFiles: 0,
  };

  dirArr.forEach((dirPath) => {
    processData(dirPath, data); // will process & updated data
  });

  console.log('Cleaning...\n');
  data.filePathArr.forEach((filePath) => {
    try {
      // Removing
      fs.rmSync(filePath, { recursive: true, force: true });
      // Updating in data
      data.deletedFiles += 1;
    } catch (error) {
      // Updating in data
      data.failedToRemoveFiles += 1;
      // console.log(`${error.code}: ${filePath}`);
    }
  });
  const t2 = performance.now();
  let time = (t2 - t1) / 1000;
  time = parseFloat(time.toFixed(time < 1 ? 3 : 1));

  //   const msg = `
  // Total Files: ${data.files}
  // Total Size: ${parseFloat((data.size / (1024 * 1024)).toFixed(1))} MB
  // Total Deleted Files: ${data.deletedFiles}
  // Total Failed To Remove Files: ${data.failedToRemoveFiles}
  // Total Time: ${time} sec
  //     `;

  // console.log(msg);
  console.log('Total Files:', data.files);
  console.log(
    'Total Size:',
    parseFloat((data.size / (1024 * 1024)).toFixed(2)),
    'MB'
  );
  console.log('Total Failed To Remove Files:', data.failedToRemoveFiles);
  console.log('Total Time:', time, 'sec');

  console.log('\nCleaning Done');

  processExit();

  return data;
};

main();
