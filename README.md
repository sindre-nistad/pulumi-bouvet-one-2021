# Pulumi Bouvet One 2021 (Q1)

All the code, and presentation used for my presentation on [Pulumi][], and how it can be used to provision infrastructure.
Even though [Pulumi support multiple cloud providers][], I will only present its integration with [Azure][].
Mainly due to familiarity, time constraints, and that I have a [Visual Studio Dev Essentials][] subscription (through [Bouvet][]), which gives me a [subscription in Azure][] for testing, and experimenting with. 
I chose TypeScript mostly due to how the runtime fits with `async/await` in Pulumi.

## Prerequisites
These steps where not shown in the presentation, as they take some time to set up, and does not add any value to the (short) presentation.

These tools are necessary to have available
- [Pulumi][download pulumi]
- [Azure CLI][]
- [Node.js][]


### Azure

```bash
az login
# Strictly speaking, this is optional, as it can be set in Pulumi, and vary between resources
# In this presentation, however, we set it for convenience
az account set --subscription "<Name of the subscription to use>"
```

### Pulumi

```bash
# We store the state locally, for convenience, and to make easier for others to got through the presentation
# Note: If you actually want to use it in a team of multiple people, I highly recommend storing the state in the cloud.
# You don't have to use the storage option offered by Pulumi, however. It can (easily) be stored in the cloud of your choice.
# It can even be stored in DropBox, or similar.
pulumi login --local

# Create a new pulumi (infrastructure) project, with the default values, and use
# the template for Azure, written in TypeScript.
pulumi new azure-typescript  --yes
```


[pulumi]: https://www.pulumi.com/
[download pulumi]: https://www.pulumi.com/docs/get-started/install/
[azure cli]: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
[Pulumi support multiple cloud providers]: https://www.pulumi.com/docs/
[Visual Studio Dev Essentials]: https://visualstudio.microsoft.com/dev-essentials/
[subscription in Azure]: https://docs.microsoft.com/en-us/azure/azure-glossary-cloud-terminology#subscription
[Azure]: https://azure.microsoft.com/en-us/
[Bouvet]: https://www.bouvet.no/
[node.js]: https://nodejs.org/en/