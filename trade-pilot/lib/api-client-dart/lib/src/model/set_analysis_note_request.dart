//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'set_analysis_note_request.g.dart';

/// SetAnalysisNoteRequest
///
/// Properties:
/// * [note] - Plain-text note (max 5000 chars). Empty/whitespace string clears the note.
@BuiltValue()
abstract class SetAnalysisNoteRequest implements Built<SetAnalysisNoteRequest, SetAnalysisNoteRequestBuilder> {
  /// Plain-text note (max 5000 chars). Empty/whitespace string clears the note.
  @BuiltValueField(wireName: r'note')
  String get note;

  SetAnalysisNoteRequest._();

  factory SetAnalysisNoteRequest([void updates(SetAnalysisNoteRequestBuilder b)]) = _$SetAnalysisNoteRequest;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SetAnalysisNoteRequestBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SetAnalysisNoteRequest> get serializer => _$SetAnalysisNoteRequestSerializer();
}

class _$SetAnalysisNoteRequestSerializer implements PrimitiveSerializer<SetAnalysisNoteRequest> {
  @override
  final Iterable<Type> types = const [SetAnalysisNoteRequest, _$SetAnalysisNoteRequest];

  @override
  final String wireName = r'SetAnalysisNoteRequest';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SetAnalysisNoteRequest object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'note';
    yield serializers.serialize(
      object.note,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    SetAnalysisNoteRequest object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SetAnalysisNoteRequestBuilder result,
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
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  SetAnalysisNoteRequest deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SetAnalysisNoteRequestBuilder();
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

