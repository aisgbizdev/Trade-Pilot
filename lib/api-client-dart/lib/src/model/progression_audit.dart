//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/progression_audit_entry.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'progression_audit.g.dart';

/// ProgressionAudit
///
/// Properties:
/// * [entries] 
@BuiltValue()
abstract class ProgressionAudit implements Built<ProgressionAudit, ProgressionAuditBuilder> {
  @BuiltValueField(wireName: r'entries')
  BuiltList<ProgressionAuditEntry> get entries;

  ProgressionAudit._();

  factory ProgressionAudit([void updates(ProgressionAuditBuilder b)]) = _$ProgressionAudit;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProgressionAuditBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProgressionAudit> get serializer => _$ProgressionAuditSerializer();
}

class _$ProgressionAuditSerializer implements PrimitiveSerializer<ProgressionAudit> {
  @override
  final Iterable<Type> types = const [ProgressionAudit, _$ProgressionAudit];

  @override
  final String wireName = r'ProgressionAudit';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProgressionAudit object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'entries';
    yield serializers.serialize(
      object.entries,
      specifiedType: const FullType(BuiltList, [FullType(ProgressionAuditEntry)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProgressionAudit object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProgressionAuditBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'entries':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(ProgressionAuditEntry)]),
          ) as BuiltList<ProgressionAuditEntry>;
          result.entries.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProgressionAudit deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProgressionAuditBuilder();
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

