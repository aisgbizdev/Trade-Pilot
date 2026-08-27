//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'broadcast.g.dart';

/// Broadcast
///
/// Properties:
/// * [id] 
/// * [senderId] 
/// * [senderName] 
/// * [title] 
/// * [message] 
/// * [audienceType] 
/// * [audienceValue] 
/// * [recipientCount] 
/// * [createdAt] 
@BuiltValue()
abstract class Broadcast implements Built<Broadcast, BroadcastBuilder> {
  @BuiltValueField(wireName: r'id')
  int get id;

  @BuiltValueField(wireName: r'senderId')
  int? get senderId;

  @BuiltValueField(wireName: r'senderName')
  String? get senderName;

  @BuiltValueField(wireName: r'title')
  String get title;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'audienceType')
  BroadcastAudienceTypeEnum get audienceType;
  // enum audienceTypeEnum {  all,  role,  tag,  };

  @BuiltValueField(wireName: r'audienceValue')
  String? get audienceValue;

  @BuiltValueField(wireName: r'recipientCount')
  int get recipientCount;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  Broadcast._();

  factory Broadcast([void updates(BroadcastBuilder b)]) = _$Broadcast;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(BroadcastBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<Broadcast> get serializer => _$BroadcastSerializer();
}

class _$BroadcastSerializer implements PrimitiveSerializer<Broadcast> {
  @override
  final Iterable<Type> types = const [Broadcast, _$Broadcast];

  @override
  final String wireName = r'Broadcast';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    Broadcast object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
    if (object.senderId != null) {
      yield r'senderId';
      yield serializers.serialize(
        object.senderId,
        specifiedType: const FullType(int),
      );
    }
    if (object.senderName != null) {
      yield r'senderName';
      yield serializers.serialize(
        object.senderName,
        specifiedType: const FullType(String),
      );
    }
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
    yield r'audienceType';
    yield serializers.serialize(
      object.audienceType,
      specifiedType: const FullType(BroadcastAudienceTypeEnum),
    );
    if (object.audienceValue != null) {
      yield r'audienceValue';
      yield serializers.serialize(
        object.audienceValue,
        specifiedType: const FullType(String),
      );
    }
    yield r'recipientCount';
    yield serializers.serialize(
      object.recipientCount,
      specifiedType: const FullType(int),
    );
    yield r'createdAt';
    yield serializers.serialize(
      object.createdAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    Broadcast object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required BroadcastBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.id = valueDes;
          break;
        case r'senderId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(int),
          ) as int?;
          if (valueDes == null) continue;
          result.senderId = valueDes;
          break;
        case r'senderName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.senderName = valueDes;
          break;
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
        case r'audienceType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BroadcastAudienceTypeEnum),
          ) as BroadcastAudienceTypeEnum;
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
        case r'recipientCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.recipientCount = valueDes;
          break;
        case r'createdAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.createdAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  Broadcast deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = BroadcastBuilder();
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

class BroadcastAudienceTypeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'all')
  static const BroadcastAudienceTypeEnum all = _$broadcastAudienceTypeEnum_all;
  @BuiltValueEnumConst(wireName: r'role')
  static const BroadcastAudienceTypeEnum role = _$broadcastAudienceTypeEnum_role;
  @BuiltValueEnumConst(wireName: r'tag')
  static const BroadcastAudienceTypeEnum tag = _$broadcastAudienceTypeEnum_tag;

  static Serializer<BroadcastAudienceTypeEnum> get serializer => _$broadcastAudienceTypeEnumSerializer;

  const BroadcastAudienceTypeEnum._(String name): super(name);

  static BuiltSet<BroadcastAudienceTypeEnum> get values => _$broadcastAudienceTypeEnumValues;
  static BroadcastAudienceTypeEnum valueOf(String name) => _$broadcastAudienceTypeEnumValueOf(name);
}

