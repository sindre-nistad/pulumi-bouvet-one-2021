import * as pulumi from '@pulumi/pulumi'
import * as resources from '@pulumi/azure-native/resources'
import * as storage from '@pulumi/azure-native/storage'
import * as asset from '@pulumi/pulumi/asset'
const fs = require('fs')

const stackName = pulumi.getStack()

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup(`BouvetOne-${stackName}`,
  {
    location: 'North Europe'
  })

const defaultOptions = {
  resourceGroupName: resourceGroup.name
}

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount('sa', {
  ...defaultOptions,
  sku: {
    name: storage.SkuName.Standard_RAGZRS
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

const blobs = ['no', 'en'].map(language => {
  const path = `presentation/index.${language}.html`

  return new storage.Blob(path, {
    ...defaultOptions,
    accountName: storageAccount.name,
    source: new asset.StringAsset(fs.readFileSync(path).toString()),
    containerName: container.name,
    blobName: `index.${language}.html`,
    contentType: 'text/html'
  })
})

export const URL_NO = blobs[0].url
export const URL_EN = blobs[1].url
