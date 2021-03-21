import * as pulumi from '@pulumi/pulumi'
import * as resources from '@pulumi/azure-native/resources'
import * as storage from '@pulumi/azure-native/storage'
import * as asset from '@pulumi/pulumi/asset'
const fs = require('fs')

const stackName = pulumi.getStack()

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup(`BouvetOne-${stackName}`)

const defaultOptions = {
  resourceGroupName: resourceGroup.name,
  location: 'norwayeast'
}

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount('sa', {
  ...defaultOptions,
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
    ...defaultOptions,
    accountName: storageAccount.name,
    publicAccess: 'Container',
    containerName: 'presentation'
  }
)

interface UploadProps {
    path: string
    blobName?: string
    contentType?: string
}

function uploadFile ({
  path,
  contentType,
  blobName
}: UploadProps): storage.Blob {
  return new storage.Blob(path, {
    ...defaultOptions,
    accountName: storageAccount.name,
    source: new asset.StringAsset(fs.readFileSync(path).toString()),
    containerName: container.name,
    blobName: blobName || path,
    contentType: contentType
  })
}

const presentationBlob = uploadFile({
  path: 'presentation/index.html',
  blobName: 'index.html',
  contentType: 'text/html'
})

export const URL = presentationBlob.url.apply(url => url)
