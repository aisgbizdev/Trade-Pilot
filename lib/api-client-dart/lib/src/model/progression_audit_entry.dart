//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'progression_audit_entry.g.dart';

/// ProgressionAuditEntry
///
/// Properties:
/// * [id]
/// * [userId]
/// * [source_]
/// * [sourceEventId]
/// * [xp]
/// * [dayBucket]
/// * [ruleVersion]
/// * [metadata]
/// * [createdAt]
@BuiltValue()
abstract class ProgressionAuditEntry implements Built<ProgressionAuditEntry, ProgressionAuditEntryBuilder> {
  @BuiltValueField(wireName: r'id')
  int get id;

  @BuiltValueField(wireName: r'userId')
  int get userId;

  @BuiltValueField(wireName: r'source')
  String get source_;

  @BuiltValueField(wireName: r'sourceEventId')
  String get sourceEventId;

  @BuiltValueField(wireName: r'xp')
  int get xp;

  @BuiltValueField(wireName: r'dayBucket')
  String get dayBucket;

  @BuiltValueField(wireName: r'ruleVersion')
  String get ruleVersion;

  @BuiltValueField(wireName: r'metadata')
  BuiltMap<String, JsonObject?> get metadata;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  ProgressionAuditEntry._();

  factory ProgressionAuditEntry([void updates(ProgressionAuditEntryBuilder b)]) = _$ProgressionAuditEntry;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProgressionAuditEntryBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProgressionAuditEntry> get serializer => _$ProgressionAuditEntrySerializer();
}

class _$ProgressionAuditEntrySerializer implements PrimitiveSerializer<ProgressionAuditEntry> {
  @override
  final Iterable<Type> types = const [ProgressionAuditEntry, _$ProgressionAuditEntry];

  @override
  final String wireName = r'ProgressionAuditEntry';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProgressionAuditEntry object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
    yield r'userId';
    yield serializers.serialize(
      object.userId,
      specifiedType: const FullType(int),
    );
    yield r'source';
    yield serializers.serialize(
      object.source_,
      specifiedType: const FullType(String),
    );
    yield r'sourceEventId';
    yield serializers.serialize(
      object.sourceEventId,
      specifiedType: const FullType(String),
    );
    yield r'xp';
    yield serializers.serialize(
      object.xp,
      specifiedType: const FullType(int),
    );
    yield r'dayBucket';
    yield serializers.serialize(
      object.dayBucket,
      specifiedType: const FullType(String),
    );
    yield r'ruleVersion';
    yield serializers.serialize(
      object.ruleVersion,
      specifiedType: const FullType(String),
    );
    yield r'metadata';
    yield serializers.serialize(
      object.metadata,
      specifiedType: const FullType(BuiltMap, [FullType(String), FullType.nullable(JsonObject)]),
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
    ProgressionAuditEntry object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProgressionAuditEntryBuilder result,
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
        case r'userId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.userId = valueDes;
          break;
        case r'source':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.source_ = valueDes;
          break;
        case r'sourceEventId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.sourceEventId = valueDes;
          break;
        case r'xp':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.xp = valueDes;
          break;
        case r'dayBucket':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.dayBucket = valueDes;
          break;
        case r'ruleVersion':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.ruleVersion = valueDes;
          break;
        case r'metadata':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltMap, [FullType(String), FullType.nullable(JsonObject)]),
          ) as BuiltMap<String, JsonObject?>;
          result.metadata.replace(valueDes);
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
  ProgressionAuditEntry deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProgressionAuditEntryBuilder();
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

