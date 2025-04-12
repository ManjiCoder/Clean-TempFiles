console.log('Jai Shree Ram');
const path = require('path');
const fs = require('fs');
const os = require('os');

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
  const time = parseFloat(((t2 - t1) / 1000).toFixed());

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
    parseFloat((data.size / (1024 * 1024)).toFixed(1)),
    'MB'
  );
  console.log('Total Failed To Remove Files:', data.failedToRemoveFiles);
  console.log('Total Time:', time, 'sec');

  console.log('\nCleaning Done');

  setTimeout(() => {
    console.log('Done');
  }, 5000);
  return data;
};

main();
