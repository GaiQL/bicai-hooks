const child_process = require('child_process');
let { deleteDir} = require('./buildTool');
const archiver = require('archiver');

const fs = require('fs');
const bankId = process.argv[2];
const envType = process.argv[3];
const bankVersion = process.argv[4] || '';
let warFilePath = `./${ bankId }`;

// deleteDir( './build' );
deleteDir( './'+bankId );
child_process.spawnSync(
    'react-app-rewired',
    [`build ${bankId} ${envType} ${bankVersion}`],
    { stdio: 'inherit',shell: true }
)

// build重命名
try{
    fs.renameSync( './build', warFilePath );
}catch( err ){
    console.log( err );process.exit();
}

