//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'progression_evidence_session.g.dart';

/// ProgressionEvidenceSession
///
/// Properties:
/// * [token] 
/// * [source_] 
/// * [subject] 
/// * [minimumCompleteAt] 
@BuiltValue()
abstract class ProgressionEvidenceSession implements Built<ProgressionEvidenceSession, ProgressionEvidenceSessionBuilder> {
  @BuiltValueField(wireName: r'token')
  String get token;

  @BuiltValueField(wireName: r'source')
  String get source_;

  @BuiltValueField(wireName: r'subject')
  String get subject;

  @BuiltValueField(wireName: r'minimumCompleteAt')
  DateTime get minimumCompleteAt;

  ProgressionEvidenceSession._();

  factory ProgressionEvidenceSession([void updates(ProgressionEvidenceSessionBuilder b)]) = _$ProgressionEvidenceSession;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProgressionEvidenceSessionBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProgressionEvidenceSession> get serializer => _$ProgressionEvidenceSessionSerializer();
}

class _$ProgressionEvidenceSessionSerializer implements PrimitiveSerializer<ProgressionEvidenceSession> {
  @override
  final Iterable<Type> types = const [ProgressionEvidenceSession, _$ProgressionEvidenceSession];

  @override
  final String wireName = r'ProgressionEvidenceSession';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProgressionEvidenceSession object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'token';
    yield serializers.serialize(
      object.token,
      specifiedType: const FullType(String),
    );
    yield r'source';
    yield serializers.serialize(
      object.source_,
      specifiedType: const FullType(String),
    );
    yield r'subject';
    yield serializers.serialize(
      object.subject,
      specifiedType: const FullType(String),
    );
    yield r'minimumCompleteAt';
    yield serializers.serialize(
      object.minimumCompleteAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProgressionEvidenceSession object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProgressionEvidenceSessionBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'token':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.token = valueDes;
          break;
        case r'source':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.source_ = valueDes;
          break;
        case r'subject':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.subject = valueDes;
          break;
        case r'minimumCompleteAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.minimumCompleteAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProgressionEvidenceSession deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProgressionEvidenceSessionBuilder();
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

