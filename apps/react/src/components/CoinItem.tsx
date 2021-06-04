import { IonAvatar, IonImg, IonItem, IonLabel, IonText } from '@ionic/react';
import React, { useState } from 'react';
import { FormattedNumber } from 'react-intl';

interface CoinProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

const CoinItem: React.FC<CoinProps> = ({ id, name, image, price }) => {

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const onImageLoaded = () => {
    setIsImageLoaded(true);
  };

  return (
    <IonItem class="coin-item" button color="primary" detail={false} routerLink={'/coins/' + id}>
      <IonAvatar slot="start" style={{ backgroundColor: 'white', padding: '2px' }}>
        <IonImg className={`${isImageLoaded && 'fade-in'}`} src={image} alt={name} onIonImgDidLoad={onImageLoaded} />
      </IonAvatar>
      <IonLabel>
        <h2 className="bold">
          <IonText color="light">
            {name}
          </IonText>
        </h2>
      </IonLabel>
      <div slot="end">
        <p className="bold">
          <FormattedNumber value={price} style="currency" currency="USD" maximumFractionDigits={8} />
        </p>
      </div>
    </IonItem>
  )
}

export default CoinItem;