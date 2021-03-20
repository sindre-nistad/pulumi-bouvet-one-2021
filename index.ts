import * as pulumi from '@pulumi/pulumi'
import * as resources from '@pulumi/azure-native/resources'
import * as storage from '@pulumi/azure-native/storage'
import * as asset from '@pulumi/pulumi/asset'
import { convertSlides } from './utils'

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

const presentationBlob = new storage.Blob('content', {
  resourceGroupName: resourceGroup.name,
  accountName: storageAccount.name,
  source: new asset.StringAsset(convertSlides()),
  containerName: container.name,
  blobName: 'index.html',
  contentType: 'text/html'
})

export const URL = presentationBlob.url.apply(url => url)
