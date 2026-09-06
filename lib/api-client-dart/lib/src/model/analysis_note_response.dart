//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analysis_note_response.g.dart';

/// Response shape for PUT /analyses/{id}/note — the persisted note body (null when cleared) and the server-stamped updatedAt.
///
/// Properties:
/// * [note] 
/// * [updatedAt] 
@BuiltValue()
abstract class AnalysisNoteResponse implements Built<AnalysisNoteResponse, AnalysisNoteResponseBuilder> {
  @BuiltValueField(wireName: r'note')
  String get note;

  @BuiltValueField(wireName: r'updatedAt')
  DateTime get updatedAt;

  AnalysisNoteResponse._();

  factory AnalysisNoteResponse([void updates(AnalysisNoteResponseBuilder b)]) = _$AnalysisNoteResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalysisNoteResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalysisNoteResponse> get serializer => _$AnalysisNoteResponseSerializer();
}

class _$AnalysisNoteResponseSerializer implements PrimitiveSerializer<AnalysisNoteResponse> {
  @override
  final Iterable<Type> types = const [AnalysisNoteResponse, _$AnalysisNoteResponse];

  @override
  final String wireName = r'AnalysisNoteResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalysisNoteResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'note';
    yield serializers.serialize(
      object.note,
      specifiedType: const FullType(String),
    );
    yield r'updatedAt';
    yield serializers.serialize(
      object.updatedAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalysisNoteResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalysisNoteResponseBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'note':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.note = valueDes;
          break;
        case r'updatedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.updatedAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalysisNoteResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalysisNoteResponseBuilder();
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

