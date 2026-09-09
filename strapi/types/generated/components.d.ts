import type { Schema, Struct } from '@strapi/strapi';

export interface ComponentBeforeafter extends Struct.ComponentSchema {
  collectionName: 'components_component_beforeafters';
  info: {
    description: '';
    icon: 'images';
    name: 'beforeafter';
  };
  attributes: {
    after: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    before: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    caption: Schema.Attribute.String;
    offset: Schema.Attribute.Float & Schema.Attribute.DefaultTo<0.5>;
  };
}

export interface ComponentContentblock extends Struct.ComponentSchema {
  collectionName: 'components_component_contentblocks';
  info: {
    description: '';
    icon: 'cube';
    name: 'contentblock';
  };
  attributes: {
    beforeafters: Schema.Attribute.Component<'component.beforeafter', true>;
    description: Schema.Attribute.RichText;
    squarestills: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    stills: Schema.Attribute.Media<'images' | 'files' | 'videos', true>;
    tag: Schema.Attribute.Relation<'oneToOne', 'api::tag.tag'>;
    title: Schema.Attribute.String;
    videoembed: Schema.Attribute.String;
    videoembedaspect: Schema.Attribute.Float;
  };
}

export interface ComponentMoreinfo extends Struct.ComponentSchema {
  collectionName: 'components_component_moreinfos';
  info: {
    description: '';
    icon: 'info';
    name: 'moreinfo';
  };
  attributes: {
    header: Schema.Attribute.String;
    link: Schema.Attribute.String;
    outlink: Schema.Attribute.Relation<'oneToOne', 'api::outlink.outlink'>;
    subheader: Schema.Attribute.String;
  };
}

export interface ComponentRandomImage extends Struct.ComponentSchema {
  collectionName: 'components_component_random_images';
  info: {
    description: '';
    icon: 'image';
    name: 'random-image';
  };
  attributes: {
    caption: Schema.Attribute.RichText;
    document: Schema.Attribute.Relation<'oneToOne', 'api::document.document'>;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'component.beforeafter': ComponentBeforeafter;
      'component.contentblock': ComponentContentblock;
      'component.moreinfo': ComponentMoreinfo;
      'component.random-image': ComponentRandomImage;
    }
  }
}
