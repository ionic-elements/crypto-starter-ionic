import { IonImg, IonItem, IonLabel, IonThumbnail } from '@ionic/react';
import React, { useState } from 'react';
import { Browser } from "@capacitor/browser";
import { FormattedDate } from 'react-intl';

interface PostProps {
  title: string;
  image: string;
  source: string;
  published: number;
  url: string;
}

const PostItem: React.FC<PostProps> = ({ title, image, source, published, url }) => {

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const onImageLoaded = () => {
    setIsImageLoaded(true);
  };

  const openUrl = (url: string) => {
    Browser.open({
      url: url,
      windowName: "_target",
      toolbarColor: "#29323c",
    });
  };

  return (
    <IonItem button color="primary" detail={false} onClick={() => openUrl(url)}>
      <IonThumbnail slot="start">
        <IonImg style={{ backgroundColor: 'white' }} className={`${isImageLoaded && 'fade-in'}`} src={image} alt={title} onIonImgDidLoad={onImageLoaded} />
      </IonThumbnail>
      <IonLabel className="ion-text-wrap">
        <h2 className="bold line-clamp-2">{title}</h2>
        <p className="bold text-md mt-xs">
          {source} | <FormattedDate value={new Date(published * 1000)} year="2-digit" month="short" day="numeric" hour="numeric" minute="2-digit" />
        </p>
      </IonLabel>
    </IonItem>
  )
}

export default PostItem;