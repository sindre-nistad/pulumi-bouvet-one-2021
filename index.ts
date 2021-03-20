import * as pulumi from '@pulumi/pulumi'
import * as resources from '@pulumi/azure-native/resources'
import * as storage from '@pulumi/azure-native/storage'
import * as asset from '@pulumi/pulumi/asset'
import { convertSlides } from './utils'
const fs = require('fs')

const stackName = pulumi.getStack()

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup(`BouvetOne-${stackName}`)

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount('sa', {
  resourceGroupName: resourceGroup.name,
  sku: {
    name: storage.SkuName.Standard_LRS
  },
  kind: storage.Kind.StorageV2,
  enableHttpsTrafficOnly: true,
  allowBlobPublicAccess: true
})

const container = new storage.BlobContainer(
  'presentation',
  {
    resourceGroupName: resourceGroup.name,
    accountName: storageAccount.name,
    publicAccess: 'Container',
    containerName: 'presentation'
  }
)

const uploadFile = async (path: string, contentType?: string): Promise<storage.Blob> => new storage.Blob(path, {
  resourceGroupName: resourceGroup.name,
  accountName: storageAccount.name,
  source: new asset.StringAsset(await fs.readFileSync(path)),
  containerName: container.name,
  blobName: path,
  contentType: contentType
})

// Upload files required by reveal.js
// For some reason, they are not bundled, when compiling the AsciDoc
const tobeUploaded: string[] = []
const glob = require('glob')
;['css', 'js', 'lib', 'plugin'].forEach(folder => {
  glob(`node_modules/reveal.js/${folder}/**/*.+(js|css|woff)`, async (err: any, files: string[]) => {
    // console.log(err)
    if (err) return
    // console.log(files)

    await Promise.all(files.map(file => uploadFile(file)))
    tobeUploaded.push(...files)
  })
  // return fs.readdirSync(`node_modules/reveal.js/${folder}`, {
  // }).map((file: string) => uploadFile(file))
})

const presentationBlob = new storage.Blob('content', {
  resourceGroupName: resourceGroup.name,
  accountName: storageAccount.name,
  source: new asset.StringAsset(convertSlides()),
  containerName: container.name,
  blobName: 'index.html',
  contentType: 'text/html'
})

export const URL = presentationBlob.url.apply(url => url)
