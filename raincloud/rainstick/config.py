import os
import yaml

def flatten_dict( dd, separator='_', prefix=''):
    return { prefix + separator + k if prefix else k : v
         for kk, vv in dd.items()
         for k, v in flatten_dict(vv, separator, kk).items()
         } if isinstance(dd, dict) else { prefix : dd }

def apply_self_refferals(dd):
    for key, val in dd.items():
        for kk in dd.keys():
            if kk in val:
                dd[key] = val.replace("${}".format(kk), dd[kk])
    return dd

app_config = ''
with open(os.path.join(os.getcwd(), "config.yml"), 'r') as f:
    app_config = apply_self_refferals(flatten_dict(yaml.safe_load(f)))
