export interface CVSResponse {
    responsePayloadData?: ResponsePayloadData;
    responseMetaData?: ResponseMetaData;
}

export interface ResponseMetaData {
    statusDesc: string;
    conversationId: string;
    refId: string;
    operation: string;
    statusCode: string;
}

export interface ResponsePayloadData {
    currentTime: Date;
    data: Data;
    isBookingCompleted: boolean;
}

export interface Data {
    GA: LocationDetails[];
}

export interface LocationDetails {
    totalAvailable: string;
    city: string;
    state: string;
    pctAvailable: string;
    status: string;
}
