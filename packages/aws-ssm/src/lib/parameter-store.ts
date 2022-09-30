import {
  DeleteParameterCommand, DeleteParameterCommandInput, DeleteParameterCommandOutput,
  GetParameterCommand,
  GetParameterCommandInput,
  GetParameterCommandOutput,
  GetParametersByPathCommand, GetParametersByPathCommandInput,
  GetParametersByPathCommandOutput,
  ParameterTier,
  ParameterType,
  PutParameterCommand,
  PutParameterCommandInput,
  PutParameterCommandOutput,
  SSMClient,
  Tag
} from "@aws-sdk/client-ssm";

export interface ParameterStoreProps {
  /**
   * SSM client to use. One is created if not provided.
   */
  readonly client?: SSMClient;

  /**
   * KMS Key ID to use when one is not specified.
   */
  readonly keyId?: string;

  /**
   * Tier to use when one is not specified. Defaults to STANDARD.
   */
  readonly tier?: ParameterTier;

  /**
   * Tags to add when saving parameters.
   */
  readonly tags?: Record<string, string>;
}

export interface SaveParameterInput {
  name: string;
  value: string | string[];
  secure: boolean;
  keyId?: string;
  description?: string;
  tags?: Record<string, string>;
  tier?: ParameterTier;
}

export class ParameterStore {

  readonly client: SSMClient;
  readonly keyId: string | undefined;
  readonly tier: ParameterTier;
  readonly tags: Record<string, string>;

  constructor(props?: ParameterStoreProps) {
    this.client = props?.client ?? new SSMClient({});
    this.keyId = props?.keyId
    this.tier = props?.tier ?? ParameterTier.STANDARD;
    this.tags = props?.tags ?? {};
  }

  protected validatePath(path: string) {
    if (!path.startsWith("/")) {
      throw new Error("Names and paths must start with '/'");
    }
    if (path !== "/" && path.endsWith("/")) {
      throw new Error("Names and paths may not end with '/'");
    }
  }

  protected toTags(tags: Record<string, string>): Tag[] {
    const merged: Record<string, string> = { ...tags, ...this.tags};
    const mapped: Tag[] = []
    for (const key in merged) {
      mapped.push({
        Key: key,
        Value: merged[key]
      });
    }
    return mapped;
  }

  async writeString(name: string, value: string, tags?: Record<string, string>, tier?: ParameterTier): Promise<number> {
    return this.write({
      name: name,
      value: value,
      tags: tags,
      tier: tier,
      secure: false
    });
  }

  async writeSecureString(name: string, value: string, keyId?: string, tags?: Record<string, string>, tier?: ParameterTier): Promise<number> {
    return this.write({
      name: name,
      value: value,
      tags: tags,
      tier: tier,
      secure: true,
      keyId: keyId
    });
  }

  async writeStringList(name: string, values: string[], tags?: Record<string, string>, tier?: ParameterTier): Promise<number> {
    return this.write({
      name: name,
      value: values,
      tags: tags,
      tier: tier,
      secure: false
    });
  }

  async write(input: SaveParameterInput): Promise<number> {
    this.validatePath(input.name);
    const command = new PutParameterCommand({
      Name: input.name,
      Value: typeof input.value === "string" ? input.value : input.value.join(","),
      Tags: this.toTags(input.tags),
      Tier: input.tier ?? this.tier,
      DataType: "text",
      Type: input.secure ? ParameterType.SECURE_STRING : typeof input.value === "string" ? ParameterType.STRING : ParameterType.STRING_LIST,
      Overwrite: true,
      Description: input.description
    });
    const response = await this.client.send<PutParameterCommandInput, PutParameterCommandOutput>(command);
    return response.Version
  }

  async remove(name: string): Promise<boolean> {
    this.validatePath(name);
    const command = new DeleteParameterCommand({
      Name: name
    });
    try {
      await this.client.send<DeleteParameterCommandInput, DeleteParameterCommandOutput>(command);
      return true;
    } catch (ParameterNotFound) {
      return false;
    }
  }

  async readValue(name: string): Promise<string | null> {
    this.validatePath(name);
    const command = new GetParameterCommand({
      Name: name,
      WithDecryption: true
    });
    try {
      const response = await this.client.send<GetParameterCommandInput, GetParameterCommandOutput>(command);
      return response.Parameter.Value
    } catch (ParameterNotFound) {
      return null;
    }
  }

  async readValuesMap(path: string, truncatePath?: boolean): Promise<Map<string, string>> {
    this.validatePath(path);
    if (truncatePath === undefined) {
      truncatePath = true;
    }
    let parameters = new Map<string, string>();
    let response: GetParametersByPathCommandOutput;
    do {
      const command = new GetParametersByPathCommand({
        Path: path,
        Recursive: true,
        WithDecryption: true,
        NextToken: response?.NextToken
      });
      response = await this.client.send<GetParametersByPathCommandInput, GetParametersByPathCommandOutput>(command);
      response.Parameters.forEach(parameter => {
        parameters[parameter.Name.substring(truncatePath ? path.length + 1 : 0)] = parameter.Value
      })
    } while (response?.NextToken !== undefined);
    return parameters;
  }

  async readValuesRecord(path: string): Promise<Record<string, any>> {
    this.validatePath(path);
    let values: Record<string, any> = {};
    let response: GetParametersByPathCommandOutput;
    do {
      const command = new GetParametersByPathCommand({
        Path: path,
        Recursive: true,
        WithDecryption: true,
        NextToken: response?.NextToken
      });
      response = await this.client.send<GetParametersByPathCommandInput, GetParametersByPathCommandOutput>(command);
      response.Parameters.forEach(parameter => {
        const parts = parameter.Name.substring(path.length + 1).split("/");
        let place = values;
        for (let i = 0; i < parts.length; i++) {
          if (place[parts[i]] === undefined) {
            place[parts[i]] = {}
          }
          if (i === parts.length - 1) {
            place[parts[i]] = parameter.Value;
            // if (parameter.Type == ParameterType.STRING_LIST) {
            //   place[parts[i]] = place[parts[i]].split(",");
            // }
          } else {
            place = place[parts[i]]
          }
        }
      });
    } while (response?.NextToken !== undefined);
    return values;
  }
}

