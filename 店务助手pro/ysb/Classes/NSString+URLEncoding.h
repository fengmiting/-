//
//  NSString+URLEncoding.h
//  IOSWebModel
//
//  Created by wind on 14-2-23.
//  Copyright (c) 2014年 tsou. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface NSString (URLEncodingAdditions)

- (NSString *)URLEncodedString;
- (NSString *)URLDecodedString;

@end
