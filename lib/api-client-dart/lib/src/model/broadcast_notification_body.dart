//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'broadcast_notification_body.g.dart';

/// BroadcastNotificationBody
///
/// Properties:
/// * [title] 
/// * [message] 
/// * [type] 
/// * [audienceType] 
/// * [audienceValue] - Role name when audienceType=role; tag name when audienceType=tag
/// * [targetRole] - Deprecated: use audienceType=role + audienceValue instead
@BuiltValue()
abstract class BroadcastNotificationBody implements Built<BroadcastNotificationBody, BroadcastNotificationBodyBuilder> {
  @BuiltValueField(wireName: r'title')
  String get title;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'type')
  BroadcastNotificationBodyTypeEnum? get type;
  // enum typeEnum {  info,  warning,  error,  };

  @BuiltValueField(wireName: r'audienceType')
  BroadcastNotificationBodyAudienceTypeEnum? get audienceType;
  // enum audienceTypeEnum {  all,  role,  tag,  };

  /// Role name when audienceType=role; tag name when audienceType=tag
  @BuiltValueField(wireName: r'audienceValue')
  String? get audienceValue;

  /// Deprecated: use audienceType=role + audienceValue instead
  @Deprecated('targetRole has been deprecated')
  @BuiltValueField(wireName: r'targetRole')
  BroadcastNotificationBodyTargetRoleEnum? get targetRole;
  // enum targetRoleEnum {  user,  admin,  super_admin,  };

  BroadcastNotificationBody._();

  factory BroadcastNotificationBody([void updates(BroadcastNotificationBodyBuilder b)]) = _$BroadcastNotificationBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(BroadcastNotificationBodyBuilder b) => b
      ..type = BroadcastNotificationBodyTypeEnum.valueOf('info')
      ..audienceType = BroadcastNotificationBodyAudienceTypeEnum.valueOf('all');

  @BuiltValueSerializer(custom: true)
  static Serializer<BroadcastNotificationBody> get serializer => _$BroadcastNotificationBodySerializer();
}

class _$BroadcastNotificationBodySerializer implements PrimitiveSerializer<BroadcastNotificationBody> {
  @override
  final Iterable<Type> types = const [BroadcastNotificationBody, _$BroadcastNotificationBody];

  @override
  final String wireName = r'BroadcastNotificationBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    BroadcastNotificationBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'title';
    yield serializers.serialize(
      object.title,
      specifiedType: const FullType(String),
    );
    yield r'message';
    yield serializers.serialize(
      object.message,
      specifiedType: const FullType(String),
    );
    if (object.type != null) {
      yield r'type';
      yield serializers.serialize(
        object.type,
        specifiedType: const FullType(BroadcastNotificationBodyTypeEnum),
      );
    }
    if (object.audienceType != null) {
      yield r'audienceType';
      yield serializers.serialize(
        object.audienceType,
        specifiedType: const FullType(BroadcastNotificationBodyAudienceTypeEnum),
      );
    }
    if (object.audienceValue != null) {
      yield r'audienceValue';
      yield serializers.serialize(
        object.audienceValue,
        specifiedType: const FullType(String),
      );
    }
    if (object.targetRole != null) {
      yield r'targetRole';
      yield serializers.serialize(
        object.targetRole,
        specifiedType: const FullType(BroadcastNotificationBodyTargetRoleEnum),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    BroadcastNotificationBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required BroadcastNotificationBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'title':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.title = valueDes;
          break;
        case r'message':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.message = valueDes;
          break;
        case r'type':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BroadcastNotificationBodyTypeEnum),
          ) as BroadcastNotificationBodyTypeEnum?;
          if (valueDes == null) continue;
          result.type = valueDes;
          break;
        case r'audienceType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BroadcastNotificationBodyAudienceTypeEnum),
          ) as BroadcastNotificationBodyAudienceTypeEnum?;
          if (valueDes == null) continue;
          result.audienceType = valueDes;
          break;
        case r'audienceValue':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.audienceValue = valueDes;
          break;
        case r'targetRole':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BroadcastNotificationBodyTargetRoleEnum),
          ) as BroadcastNotificationBodyTargetRoleEnum?;
          if (valueDes == null) continue;
          result.targetRole = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  BroadcastNotificationBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = BroadcastNotificationBodyBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}

class BroadcastNotificationBodyTypeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'info')
  static const BroadcastNotificationBodyTypeEnum info = _$broadcastNotificationBodyTypeEnum_info;
  @BuiltValueEnumConst(wireName: r'warning')
  static const BroadcastNotificationBodyTypeEnum warning = _$broadcastNotificationBodyTypeEnum_warning;
  @BuiltValueEnumConst(wireName: r'error')
  static const BroadcastNotificationBodyTypeEnum error = _$broadcastNotificationBodyTypeEnum_error;

  static Serializer<BroadcastNotificationBodyTypeEnum> get serializer => _$broadcastNotificationBodyTypeEnumSerializer;

  const BroadcastNotificationBodyTypeEnum._(String name): super(name);

  static BuiltSet<BroadcastNotificationBodyTypeEnum> get values => _$broadcastNotificationBodyTypeEnumValues;
  static BroadcastNotificationBodyTypeEnum valueOf(String name) => _$broadcastNotificationBodyTypeEnumValueOf(name);
}

class BroadcastNotificationBodyAudienceTypeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'all')
  static const BroadcastNotificationBodyAudienceTypeEnum all = _$broadcastNotificationBodyAudienceTypeEnum_all;
  @BuiltValueEnumConst(wireName: r'role')
  static const BroadcastNotificationBodyAudienceTypeEnum role = _$broadcastNotificationBodyAudienceTypeEnum_role;
  @BuiltValueEnumConst(wireName: r'tag')
  static const BroadcastNotificationBodyAudienceTypeEnum tag = _$broadcastNotificationBodyAudienceTypeEnum_tag;

  static Serializer<BroadcastNotificationBodyAudienceTypeEnum> get serializer => _$broadcastNotificationBodyAudienceTypeEnumSerializer;

  const BroadcastNotificationBodyAudienceTypeEnum._(String name): super(name);

  static BuiltSet<BroadcastNotificationBodyAudienceTypeEnum> get values => _$broadcastNotificationBodyAudienceTypeEnumValues;
  static BroadcastNotificationBodyAudienceTypeEnum valueOf(String name) => _$broadcastNotificationBodyAudienceTypeEnumValueOf(name);
}

class BroadcastNotificationBodyTargetRoleEnum extends EnumClass {

  /// Deprecated: use audienceType=role + audienceValue instead
  @BuiltValueEnumConst(wireName: r'user')
  static const BroadcastNotificationBodyTargetRoleEnum user = _$broadcastNotificationBodyTargetRoleEnum_user;
  /// Deprecated: use audienceType=role + audienceValue instead
  @BuiltValueEnumConst(wireName: r'admin')
  static const BroadcastNotificationBodyTargetRoleEnum admin = _$broadcastNotificationBodyTargetRoleEnum_admin;
  /// Deprecated: use audienceType=role + audienceValue instead
  @BuiltValueEnumConst(wireName: r'super_admin')
  static const BroadcastNotificationBodyTargetRoleEnum superAdmin = _$broadcastNotificationBodyTargetRoleEnum_superAdmin;

  static Serializer<BroadcastNotificationBodyTargetRoleEnum> get serializer => _$broadcastNotificationBodyTargetRoleEnumSerializer;

  const BroadcastNotificationBodyTargetRoleEnum._(String name): super(name);

  static BuiltSet<BroadcastNotificationBodyTargetRoleEnum> get values => _$broadcastNotificationBodyTargetRoleEnumValues;
  static BroadcastNotificationBodyTargetRoleEnum valueOf(String name) => _$broadcastNotificationBodyTargetRoleEnumValueOf(name);
}

