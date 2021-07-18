declare namespace API {
  module Feed {
    interface PublicPhotoFeed {
      title: string;
      link: string;
      description: string;
      modified: string;
      generator: string;
      items: FeedItem[];
    }
    
    interface FeedItem {
      title: string;
      link: string;
      media: FeedItemMedia;
      date_taken: string;
      description: string;
      published: string;
      author: string;
      author_id: string;
      tags: string;
    }
    
    interface FeedItemMedia {
      m: string;
    }
  }
}